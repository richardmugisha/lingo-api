require('dotenv').config()

const getWordModel = require('../models/word/word')
const connectDB = require('../db/connect');


const testing = process.env.testing

const {promptMaker, initial} = require('./openaiHelper')

const OpenAI = require('openai')

const contentLogger = require('./logger')

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

const finalSender = async (words, regularOrTemporaryDeck) => {
    const generateData = [];
    try {
        for (const wordObject of words) {
            delete wordObject['root word']
            let related_words = []
            Object.values(wordObject).map(expressions => { related_words = [...related_words, ...expressions] })
            //console.log(wordObject)
            for (const [k, v] of Object.entries(wordObject)) {if (!v.length) delete wordObject[k]}
            const prompt = promptMaker(JSON.stringify(wordObject), regularOrTemporaryDeck)
            // console.log(prompt)
            const chatCompletion = testing ? null : await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [{ role: "user", content: prompt}]
            })
            
            const genArr = JSON.parse(chatCompletion.choices[0].message.content).map(obj => ({...obj, 'related words': related_words } ))
            generateData.push(genArr)
        }
        return {msg: 'All words were processed', words: generateData }
    } catch (error) {
        return {msg: `Error occured after the processing of the ${generateData.length}th word: ${error}`, words: generateData}
    }
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
        const variations = await initialSender(words)
        // console.log(variations)
        return await finalSender(variations, regularOrTemporaryDeck)
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

module.exports = {
    openaiProcess
}

const testWords0 = 'breathe, eager, spill the beans'

const testWords1 = 'think, emerald, strong, alibi, terrible, thunder, worry, realize, things, already, vain, terrific, mass, weight, strings, orbit, planet, waffle, delusion, regular, laugh, take, keep, mix';

const testWords2 = 'breathe, eager, spill the beans, jump, serene, strike while the iron is hot, dance, fortunate, a blessing in disguise, run, fierce, bark up the wrong tree, shatter, glorious, actions speak louder than words'


const d = [
    {
      type: 'noun',
      word: 'spill',
      'language style': '',
      meaning: 'an instance of spilling liquid or small particles.',
      example: 'I had a spill on my shirt from the coffee.',
      'blanked example': 'I had a ___ on my shirt from the coffee.',
      synonym: '',
      antonym: ''
    },
    {
      type: 'verb',
      word: 'spill',
      'language style': '',
      meaning: 'cause or allow (liquid) to flow over the edge of its container, especially unintentionally.',
      example: 'Be careful not to spill your drink.',
      'blanked example': 'Be careful not to ___ your drink.',
      synonym: '',
      antonym: ''
    },
    {
      type: 'phrasal verb',
      word: 'spill out',
      'language style': '',
      meaning: 'cause or allow (liquid) to flow out of its container.',
      example: 'The water spilled out of the bucket.',
      'blanked example': 'The water _______ of the bucket.',
      synonym: '',
      antonym: ''
    },
    {
      type: 'phrasal verb',
      word: 'spill over',
      'language style': '',
      meaning: 'overflow or spread beyond its limits.',
      example: 'The excitement spilled over into the next day.',
      'blanked example': 'The excitement ______ into the next day.',
      synonym: '',
      antonym: ''
    },
    {
      type: 'phrasal verb',
      word: 'spill the beans',
      'language style': '',
      meaning: 'reveal a secret, especially carelessly or by mistake.',
      example: 'She accidentally spilled the beans about the surprise party.',
      'blanked example': 'She accidentally ____ the beans about the surprise party.',
      synonym: '',
      antonym: ''
    }
  ]

// openaiProcess(testWords2, 'regular deck')
// .then(async({ msg, words}) => {
//     try {
//         console.log(msg, words)
//         await connectDB(process.env.MONGO_URI);
//         const WordModel = getWordModel('English');
//         await WordModel.insertMany(words)
//         console.log('job done')
//     } catch (error) {
//       if (error.name === 'MongoServerError' && error.code === 11000) {
//         console.log('Duplicate entry detected:', error.message);
//       } else {
//         console.log('An error occurred:', error.message);
//       }
//     }
// })