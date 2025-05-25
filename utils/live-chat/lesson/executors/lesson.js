import { sysMsg, msg } from "../prompts/lesson.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (instructor) => {
    try {
        const sysPrompt = sysMsg(instructor)
        const prompt = msg(instructor)

        const response = await openaiRequest("gpt-4o-mini", sysPrompt, prompt)

        return response
        
    } catch (error) {
        console.log(error.message)
    }
}