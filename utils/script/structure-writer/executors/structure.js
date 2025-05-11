
import { structure as structurePrompt, structureSysMsg } from "../prompts/structure.js";
import openaiRequest from "../../../openai-process/openaiRequest.js";

const structureBuild = async (topicData) => {
    try {
        const prompt = structurePrompt(topicData.topic, topicData.subtopics)
        const structure = await openaiRequest("gpt-4o-mini", structureSysMsg, prompt)
        return JSON.parse(structure)
    } catch (error) {
        console.log(error.message)
    }
}

export default structureBuild

