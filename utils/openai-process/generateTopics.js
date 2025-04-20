
import openaiRequest from "./openaiRequest.js";
import {
    topicGenerationPrompt, topicSystmMsg
} from "../openaiHelper.js"

const generate = async (path, topic, number, excluded) => {
    try {
        const prompt = topicGenerationPrompt(path, topic, number, excluded)
        console.log(prompt)
        const topics = await openaiRequest("gpt-4o", topicSystmMsg, prompt)
        // console.log(topics)
        return JSON.parse(topics)
    } catch (error) {
        console.log(error)
    }
}

export default generate