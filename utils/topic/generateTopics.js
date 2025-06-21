
import openaiRequest from "../openai-process/openaiRequest.js";
import {
    topic as topicPrompt, topicSysMsg
} from "./index.js"

const generate = async (path, topic, number, excluded) => {
    try {
        const prompt = topicPrompt(path, topic, number, excluded)
        // console.log(prompt)
        const topics = await openaiRequest("gpt-4o", topicSysMsg, prompt)
        // console.log(topics)
        return JSON.parse(topics)
    } catch (error) {
        console.log(error)
    }
}

export default generate