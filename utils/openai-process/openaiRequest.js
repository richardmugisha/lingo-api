require('dotenv').config()

const OpenAI = require('openai') 

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY}); 

const openaiRequest = async (MODEL, prompt) => {
    console.log('----------inside openai request', prompt)
    try {
        const chatCompletion = await openai.chat.completions.create(
            MODEL === 'gpt-4o' ?
            {
                model: MODEL,
                response_format: {"type": "json_object"},
                messages: [
                    { role: "user", content: prompt}
                ]
            } :
            {
                model: MODEL,
                messages: [
                    { role: "user", content: prompt}
                ]
            }
    )

        
        return chatCompletion.choices[0].message.content
    } catch (error) {
        throw new Error(`\n-----Error with openai itself: ${error}`)
    }
}

module.exports = openaiRequest