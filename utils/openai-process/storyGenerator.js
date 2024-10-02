
const openaiRequest = require('./openaiRequest')

const {fullStoryPrompt, chunkStoryPrompt} = require('../openaiHelper')

const fullStoryGen = async (title, summary, words) => {
    try {
        const prompt = fullStoryPrompt(title, summary, words)
        const story = await openaiRequest("gpt-4o", prompt)
        console.log(story)
        return JSON.parse(story)
    } catch (error) {
        throw new Error(error.message)
    }
}

const aiCoEditor = async (title, summary, words, currentStory) => {
    try {
        const prompt = chunkStoryPrompt(title, summary, words, currentStory);
        const halfStoryObj = await openaiRequest("gpt-4o", prompt)
        console.log(halfStoryObj)
        return JSON.parse(halfStoryObj)
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    fullStoryGen,
    aiCoEditor
}
