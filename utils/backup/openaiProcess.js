require('dotenv').config()

const testing = process.env.testing

const { promptMaker, completeString, incompleteString } = require('./openaiHelper')

const OpenAI = require('openai')

const contentLogger = require('./logger')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const openaiProcess = async (words, regularOrTemporaryDeck) => {
    let generateData;
    try {
        const prompt = promptMaker(words, regularOrTemporaryDeck)
        const chatCompletion = testing ? null : await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
        })
        generateData = testing ? (testing === 'incompleteString' ? incompleteString : completeString) : 
                                chatCompletion.choices[0].message.content;
        if (process.env.NODE_ENV ==='dev') contentLogger(generateData)
        if (testing === 'completeString') {
            return  {
                processed : JSON.parse(completeString),
                unprocessed : []
            }
        }
        if (testing === 'incompleteString' || chatCompletion.choices[0].finish_reason === 'length') {
            //come here and test temporary deck
            console.log('we landed here')
            return advancedParsing(generateData)
        }

        return {
            processed : JSON.parse(generateData),
            unprocessed : []
        }
        

    } catch (error) {
        throw new Error(error)
    }
}

module.exports = {
    openaiProcess
}

const advancedParsing = (string, words) => {
    let properObjects = '';
    for (const char of string.split('{"root word"')) {
        const properObject = (char === '[') ? "[" : '{"root word"' + char
        if (properObject.split('{').length === properObject.split('}').length) {
            properObjects += properObject;
        }
    }

    console.log('before parsing\n\n', properObjects)
    const properList = JSON.parse(properObjects += '{}]')
    properList.pop()

    const unprocessed = words.split(',').filter(word => {
        const properWord = word.trim();
        for (const family of properList) {
            let partOf = family['root word'] === properWord 
            if (partOf) {
                console.log(' match : ', family['root word'], ' and ' , properWord)
                return false //already processed
            }
                
            partOf = family.variations.some(({variationWord, wordReferenceInExample}) => [variationWord, wordReferenceInExample].includes(properWord))
            if (partOf) {
                console.log(' match : ', family['root word'], ' and ' , properWord)
                return false
            }
        }
        return true
    })

    return { processed: properList, unprocessed }
}

openaiProcess('laugh, take, keep, mix, think, emerald, strong, alibi, terrible, thunder, worry, realize, things, already, vain, terrific, mass, weight, strings, orbit, planet, waffle, delusion, regular'
).then(d => console.log(d.processed, '\n\n\n', d.unprocessed))