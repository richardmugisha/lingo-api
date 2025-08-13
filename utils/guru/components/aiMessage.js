
import openaiRequest from "../../openai-process/openaiRequest.js"

export default async (summary, messages) => {
    try {
        const prompt = `Help generate a good reply conversation as the assistant in this conversation:\n\n
        ${summary ? `Summary of past back-and-forths: ${summary}\n\n` : ""}

        Last few back-and-forths:\n
        ${messages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}\n\n

        Your reply should not contain anything else outside the reply itself.\n

        Your reply:
        `
        const systemMsg = "You are an expert at meaningful conversations."
        const MODEL = "gpt-4o-mini";

        const reply = await openaiRequest(MODEL, systemMsg, prompt, true);
        return [reply.trim(), null];
    } catch (error) {
       return [null, error];  
    }
}