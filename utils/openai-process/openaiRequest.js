import dotenv from 'dotenv'
dotenv.config()

import OpenAI from 'openai'

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); 

const openaiRequest = async (MODEL, systemMsg, prompt, simple) => {
    try {
        const messages = [
            { role: "system", content: systemMsg},
            { role: "user", content: prompt}
        ];
        
        const shouldUseJsonFormat = ['gpt-4o', 'gpt-4o-mini'].includes(MODEL) && !simple;
        const hasJsonInMessages = messages.some(msg => 
            msg.content.toLowerCase().includes('json')
        );

        const chatCompletion = await openai.chat.completions.create({
            model: MODEL,
            messages,
            ...(shouldUseJsonFormat && hasJsonInMessages && { 
                response_format: { type: "json_object" } 
            })
        });
        
        return chatCompletion.choices[0].message.content
    } catch (error) {
        throw new Error(`\n-----Error with openai itself: ${error}`)
    }
}

export default openaiRequest