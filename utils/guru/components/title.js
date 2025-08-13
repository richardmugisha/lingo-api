import openaiRequest from "../../openai-process/openaiRequest.js"

export default async (messages) => {
    try {
        const prompt = `Help generate a title for the following conversation:\n\n
        
        ${messages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}\n\n

        The title should be concise and meaningful, summarizing the essence of the main conversation. A good title should contain 3 words or less.
        The title should not be surrounded by quotation marks. Just give it to me as is.
        `
        const systemMsg = "You are an expert at generating concise titles."
        const MODEL = "gpt-4o-mini";

        const title = await openaiRequest(MODEL, systemMsg, prompt, true);
        return [title.trim(), null];
    } catch (error) {
       return [null, error];  
    }
}