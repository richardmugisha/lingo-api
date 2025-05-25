import { sysMsg, msg } from "../prompts/updateUserAssistantPast.js";
import openaiRequest from "../../../openai-process/openaiRequest.js";

export default async (chatObj, currentChat, user, assistant, pastData) => {
    try {
        // Get the system message and prompt
        const systemMessage = sysMsg();
        const prompt = msg(chatObj, currentChat, user, assistant, pastData);

        // Make the OpenAI request
        const response = await openaiRequest("gpt-4o-mini", systemMessage, prompt, false);

        // Parse the response which should be a JSON object with the required fields
        const parsedData = JSON.parse(response);
        
        return {
            userPreferences: parsedData.userPreferences,
            userFacts: parsedData.userFacts,
            lastInteraction: parsedData.lastInteraction
        };
    } catch (error) {
        console.error("Error in updateUserAssistantPast:", error.message);
        throw error;
    }
}
