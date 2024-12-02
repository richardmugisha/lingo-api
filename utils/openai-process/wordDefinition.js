require('dotenv').config()

const {promptMaker, initial} = require('../openaiHelper')

const openaiRequest = require('./openaiRequest')

const wordDefiner = async (words, regularOrTemporaryDeck) => {
    const parent = async (wordObject, regularOrTemporaryDeck) => {    
        const reusable = async () => {
            delete wordObject['root word']
            let related_words = []
            Object.values(wordObject).map(expressions => { related_words = [...related_words, ...(expressions.map(obj => obj.word).filter(a => a))] })
            for (const [k, v] of Object.entries(wordObject)) {if (!v.length) delete wordObject[k]}
            const prompt = promptMaker(JSON.stringify(wordObject), regularOrTemporaryDeck)
            const openaiRes = await openaiRequest("gpt-3.5-turbo-1106", prompt)
            const { definitions } = JSON.parse(openaiRes)
            console.log('--------- word definer result: \n', definitions.map(obj => ({...obj, 'related words': related_words } )))
            return definitions.map(obj => ({...obj, 'related words': related_words } ))
        }
        for (let i = 0; i < 3; i++) {
            try { return await reusable()} 
            catch (error) {
                console.log('retrying: ', `${i}th try with error: ${error.message}`)
                return await reusable()
            }
        }
        throw new Error('Kept trying to run openai process by the response kept beging rejected by JSON parse')
    }
    const promises = words.map((wordObject, index) => parent(wordObject, regularOrTemporaryDeck).then(response => ({ response, index })) )
    const results = await Promise.all(promises);
    const orderedResults = results.sort((a, b) => a.index - b.index);
    const generateData = orderedResults.map(result => result.response);
    return {msg: 'done', words: generateData}
}

const wordFamilyGenerator = async (words) => {
    try {
        const prompt = initial(words)
        const openaiRes = await openaiRequest("gpt-4o", prompt)
        console.log(openaiRes)
        return JSON.parse(openaiRes)
    }
    catch (error) {
        console.log(error.message)
        throw new Error("\n-----error generating the list of variations: ", error)
    }
}

const processTimeLogger = (time) => {
    if (time) {
        console.timeEnd(time)
    }
    else {
        const startTime = new Date().toLocaleTimeString()
        console.time(startTime)
        return startTime
    }
}

const wordDefinition = async (words, regularOrTemporaryDeck) => {
    try {
        let processStartTime = processTimeLogger()
        const response = await wordFamilyGenerator(words)
        const wordFamilies = response["word families"]
        // console.log('words families', wordFamilies.length)
        console.log('-----words families: ', wordFamilies)
        processTimeLogger(processStartTime); 
        processStartTime = processTimeLogger()
        console.log('.....now proper openai starts')
        const result = await wordDefiner(wordFamilies, regularOrTemporaryDeck)
        processTimeLogger(processStartTime)
        return result
    } catch (error) {
        console.log(error.message)
        throw new Error(`\n-----Error with word definition process: ${error}`)
        // return {msg: `Error processing the words: ${error}`, words: generateData}
    }
}



module.exports = wordDefinition

