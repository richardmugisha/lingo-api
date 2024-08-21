require('dotenv').config()

const testing = process.env.testing

const promptMaker = require('./openaiHelper')

const OpenAI = require('openai')

const contentLogger = require('./logger')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

let variations = "";
let generateData = "";

const varPrompt = 'I am giving you a list of words, and I want you to only return me a straight and valid js array of their families. The list: [{ "root word": your computed most basic root word, "variations": [ an exhaustive list of variants of the root word. The include noun (no plurars), verb (there should only be one verb and it should NOT!!! be conjugated), adj (no comparatives or superlatives. Just the basic form), adverb, idiom, proverb, phrasal verb], {...}, {...}]. The words: '

const promptSender = async (which, words, regularOrTemporaryDeck, continuation = false, pastChunk) => {
    console.log(continuation, continuation && pastChunk)
    const prompt = which === 'final' ? promptMaker(words, regularOrTemporaryDeck, continuation, pastChunk) : varPrompt + words
    const chatCompletion = testing ? null : await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
    })
    if (which === 'final') generateData += chatCompletion.choices[0].message.content
    else variations += chatCompletion.choices[0].message.content
    const rootWords = [...(which === 'final' ? generateData : variations).matchAll(/"root word":\s*"([^"]+)"/g)].map(match => match[1]);
    console.log(rootWords)
    if (chatCompletion.choices[0].finish_reason === 'length') await promptSender(which, words, regularOrTemporaryDeck, true, chatCompletion.choices[0].message.content.slice(-1000))
}

const openaiProcess = async (words, regularOrTemporaryDeck) => {
    try {
        await promptSender('initial', words)
        if (process.env.NODE_ENV ==='dev') contentLogger(variations)
        await promptSender('final', variations, regularOrTemporaryDeck)
        if (process.env.NODE_ENV ==='dev') contentLogger(generateData)
        return JSON.parse(generateData)
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    openaiProcess
}

const testWords = 'think, emerald, strong, alibi, terrible, thunder, worry, realize, things, already, vain, terrific, mass, weight, strings, orbit, planet, waffle, delusion, regular, laugh, take, keep, mix'

if (testing) openaiProcess(testWords).then(data => console.log(data))