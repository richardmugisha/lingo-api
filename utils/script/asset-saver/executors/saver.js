import { saver as saverPrompt, saverSysMsg } from "../prompts/saver.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"
import { saveAssets } from "../../assets/index.js"

export default async (props, scene, guide) => {
    try {
        // Create a flat memory graph where each entity is a direct key
        const focusedMemoryGraph = {};

        // Populate the focused memory graph based on the guide
        Object.entries(guide).forEach(([entity, category]) => {
            const existingAsset = props.assets[category]?.find(asset => asset.name === entity);
            if (existingAsset) {
                focusedMemoryGraph[entity] = existingAsset;
            } else {
                focusedMemoryGraph[entity] = {
                    name: entity,
                    identity: "",
                    summary: "",
                    history: "",
                    recent: "",
                    relationships: ""
                };
            }
        });

        const prompt = saverPrompt(
            focusedMemoryGraph,
            props.script,
            props.episode.logline,
            props.act.logline,
            props.scenes.map(sc => sc.logline),
            scene
        );

        const savingInstructions = await openaiRequest("gpt-4o-mini", saverSysMsg, prompt);
        const parsedInstructions = JSON.parse(savingInstructions);

        // Validate that the saver only returned updates for entities in the guide
        const validUpdates = {};
        Object.entries(parsedInstructions).forEach(([entity, update]) => {
            if (guide.hasOwnProperty(entity)) {
                validUpdates[entity] = update;
            } else {
                console.warn(`Saver tried to update ${entity} which wasn't in the guide`);
            }
        });

        saveAssets(guide, validUpdates, props.assets);
        return validUpdates;
    } catch (error) {
        console.log(error.message);
    }
}