import openaiRequest from "../../openai-process/openaiRequest.js"

export default async (summary, messages) => {
    try {
        const prompt = `Help generate a summary for the following conversation:\n\n
        ${summary ? `Summary of past back-and-forths: ${summary}\n\n` : ""}

        Last few back-and-forths:\n
        ${messages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}\n\n

        The summary should be 3 to 5 paragraphs, covering the key points of the main conversation.
        `
        const systemMsg = "You are an expert in summarizing conversations."
        const MODEL = "gpt-4o-mini";

        const title = await openaiRequest(MODEL, systemMsg, prompt, true);
        return [title.trim(), null];
    } catch (error) {
       return [null, error];  
    }
}