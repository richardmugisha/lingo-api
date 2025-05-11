
import { definition, definitionSysMsg} from "../prompts/definition.js"
import openaiRequest from "../../openai-process/openaiRequest.js";

export default async (wordExamples) => {
    const chunkSize = 10;
    const allDefinitions = [];

    try {
        for (let i = 0; i < wordExamples.length; i += chunkSize) {
            const chunk = wordExamples.slice(i, i + chunkSize);
            const prompt = definition(chunk);
            const openaiRes = await openaiRequest("gpt-4o", definitionSysMsg, prompt);
            const { definitions } = JSON.parse(openaiRes);
            allDefinitions.push(...definitions);
        }

        return allDefinitions;
    } catch (error) {
        console.error("Error in simpleWordDefiner:", error.message);
        throw new Error("Failed to define words: " + error.message);
    }
};
