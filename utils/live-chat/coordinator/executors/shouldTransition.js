
import { sysMsg, msg } from "../prompts/shouldTransition.js";
import openaiRequest from "../../../openai-process/openaiRequest.js";  

export default async (chat) => {
    try {
        const sysPrompt = sysMsg()
        const prompt = msg(chat)

        const verdict = await openaiRequest("gpt-4o-mini", sysPrompt, prompt, false)
        console.log(verdict, chat)
        return JSON.parse(verdict).shouldTransition

    } catch (error) {
        console.log(error.message)
    } 
}