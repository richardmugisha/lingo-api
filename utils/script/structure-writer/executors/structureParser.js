
import scriptParser from "../prompts/structureParser.js";
import openaiRequest from "../../../openai-process/openaiRequest.js";

const structureParser = async (rawScript) => {
    try {
        const toJSONprompt = scriptParser(rawScript)
        const jsonStructure = await openaiRequest("gpt-4o-mini", "You are a helpful assistant", toJSONprompt)

        return JSON.parse(jsonStructure)

    } catch (error) {
        console.log(error.message)
    }
}

export default structureParser
