require('dotenv').config()

const getWordModel = require('../../models/word/word')

const testing = process.env.testing

const {promptMaker, initial, fullStoryPrompt, chunkStoryPrompt} = require('../openaiHelper')

const OpenAI = require('openai')

const contentLogger = require('../logger')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const finalSender = async (words, regularOrTemporaryDeck) => {
    const reusableSender = async (wordObject, regularOrTemporaryDeck) => {    
        const innerSender = async () => {
            delete wordObject['root word']
            let related_words = []
            Object.values(wordObject).map(expressions => { related_words = [...related_words, ...expressions] })
            for (const [k, v] of Object.entries(wordObject)) {if (!v.length) delete wordObject[k]}
            //console.log(wordObject)
            const prompt = promptMaker(JSON.stringify(wordObject), regularOrTemporaryDeck)
            // console.log(prompt)
            const chatCompletion = testing ? null : await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                        messages: [{ role: "user", content: prompt}]
            })
            return JSON.parse(chatCompletion.choices[0].message.content).map(obj => ({...obj, 'related words': related_words } ))
        }
        for (let i = 0; i < 3; i++) {
            try {
                console.log('retrying: ', `${i}th try`)
                return await innerSender()
            } catch (error) {
                console.log('retrying: ', `${i}th try with error: ${error.message}`)
                return await innerSender()
            }
        }
        throw new Error('Kept trying to run openai process by the response kept beging rejected by JSON parse')
    }
    const promises = words.map((wordObject, index) => reusableSender(wordObject, regularOrTemporaryDeck).then(response => ({ response, index })) )
    const results = await Promise.all(promises);
    const orderedResults = results.sort((a, b) => a.index - b.index);
    const generateData = orderedResults.map(result => result.response);
    return {msg: 'done', words: generateData}
}

const initialSender = async (words) => {
    try {
        //const prompt = varPrompt + words
        const prompt = initial(words)
        const chatCompletion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt}]
        })
        return JSON.parse(chatCompletion.choices[0].message.content)
    }
    catch (error) {
        throw new Error("error generating the list of variations: ", error)
    }
}

const openaiProcess = async (words, regularOrTemporaryDeck) => {
    try {
        console.time()
        const variations = await initialSender(words)
        console.log('variations', variations.length)
        console.timeEnd(); console.time()
        console.log('.....now proper openai starts')
        const result = await finalSender(variations, regularOrTemporaryDeck)
        console.timeEnd();
        return result
    } catch (error) {
        console.log(error)
        return {msg: `Error processing the words: ${error}`, words: generateData}
    }
    finally {
        // if (process.env.NODE_ENV ==='dev') console.log(variations)
        // if (process.env.NODE_ENV ==='dev') contentLogger(generateData)
        // generateData = ""; variations = ""
    }
}

const fullStoryGen = async (title, summary, words) => {
    try {
        const prompt = fullStoryPrompt(title, summary, words)
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
        })
        const genObj = chatCompletion.choices[0].message.content
        // console.log(genObj)
        return JSON.parse(genObj)

    } catch (error) {
        console.log(error)
    }
}

const aiCoEditor = async (title, summary, words, currentStory) => {
    try {
        const prompt = chunkStoryPrompt(title, summary, words, currentStory);
        console.log(prompt)
        const chatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
        })
        const genObj = chatCompletion.choices[0].message.content
        console.log(genObj)
        return JSON.parse(genObj)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    openaiProcess,
    fullStoryGen,
    aiCoEditor
}

const testWords0 = 'breathe, eager, spill the beans'

const testWords1 = 'think, emerald, strong, alibi, terrible, thunder, worry, realize, things, already, vain, terrific, mass, weight, strings, orbit, planet, waffle, delusion, regular, laugh, take, keep, mix';

const testWords2 = 'breathe, eager, spill the beans, jump, serene, strike while the iron is hot, dance, fortunate, a blessing in disguise, run, fierce, bark up the wrong tree, shatter, glorious, actions speak louder than words'


// const comb = testWords2 + ', ' + testWords1 + ', ' + testWords0
// console.log(comb.split(', ').length)
// openaiProcess(comb, 'regular deck')
// .then(async({ msg, words}) => {
//     try {
//         contentLogger(JSON.stringify(words))
//         console.log(msg, words.length)
//         console.log('job done')
//     } catch (error) {
//         console.log('An error occurred:', error.message);
//     }
// })