
import { saver as saverPrompt, saverSysMsg } from "../prompts/saver.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"
import { loadStructure, loadAssets, extractKeyDetails, saveAssets } from "../../assets/index.js"

export default async (scene, guide) => {
    try {
        const structure = loadStructure()
        const keyAssets = loadAssets(guide)
        const { episode, act, scenes } = extractKeyDetails(structure, 0, 0, 0)
        // console.log(keyAssets)

        const prompt = saverPrompt(keyAssets, structure, episode.logline, act.logline, scenes.map(sc => sc.logline), scene)
        // console.log(prompt)

        const savingInstructions = await openaiRequest("gpt-4o-mini", saverSysMsg, prompt)

        // console.log(savingInstructions)

        saveAssets(guide, JSON.parse(savingInstructions))

        return savingInstructions
        
    } catch (error) {
        console.log(error.message)
    }
}
