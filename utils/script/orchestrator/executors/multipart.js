
import openaiRequest from "../../../openai-process/openaiRequest.js";
import { multipart as multipartPrompt, multipartSysMsg } from "../prompts/multipart.js"

const multipart = async (structure) => {
    try {
        const prompt = multipartPrompt(3, structure)
        const multipartRes = await openaiRequest("gpt-4o", multipartSysMsg, prompt)
        return multipartRes
    } catch (error) {
        console.log(error.message)
    }
}

export default multipart