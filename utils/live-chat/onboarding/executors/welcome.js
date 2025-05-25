import { sysMsg, msg } from "../prompts/welcome.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (onboarder) => {
    try {
        console.log('onboarder: ', onboarder)
        const sysPrompt = sysMsg(onboarder)
        const prompt = msg(onboarder)
        const response = await openaiRequest("gpt-4o-mini", sysPrompt, prompt)
        return response
    } catch (error) {
        console.log(error.message)
    }
}