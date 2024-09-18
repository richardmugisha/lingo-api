
const openaiRequest = require('./openaiRequest')

const {fullStoryPrompt, chunkStoryPrompt} = require('../openaiHelper')

const fullStoryGen = async (title, summary, words) => {
    try {
        const prompt = fullStoryPrompt(title, summary, words)
        const story = await openaiRequest("gpt-3.5-turbo", prompt)
        console.log(story)
        return JSON.parse(story)
    } catch (error) {
        console.log(error)
    }
}

const aiCoEditor = async (title, summary, words, currentStory) => {
    try {
        const prompt = chunkStoryPrompt(title, summary, words, currentStory);
        const halfStoryObj = await openaiRequest("gpt-3.5-turbo", prompt)
        console.log(halfStoryObj)
        return JSON.parse(halfStoryObj)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    fullStoryGen,
    aiCoEditor
}
