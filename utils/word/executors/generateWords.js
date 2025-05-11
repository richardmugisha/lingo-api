
import openaiRequest from "../../openai-process/openaiRequest.js";
import {
    wordGenerationPrompt, wordSystmMsg
} from "../../openaiHelper.js"

const generate = async (path, topic, number, excluded) => {
    try {
        const prompt = wordGenerationPrompt(path, topic, number, excluded)
        // console.log(prompt)
        const suggestions = await openaiRequest("gpt-4o", wordSystmMsg, prompt)
        return JSON.parse(suggestions)
    } catch (error) {
        console.log(error)
    }
}

export default generate