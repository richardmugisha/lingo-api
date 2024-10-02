require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const openaiRequest = async (MODEL, prompt) => {
    const chatCompletion = await openai.chat.completions.create({
        model: MODEL,
        response_format: {"type": "json_object"},
        messages: [{ role: "user", content: prompt}]
    })
    return chatCompletion.choices[0].message.content
}

module.exports = openaiRequest