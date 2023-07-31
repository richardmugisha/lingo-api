const Card = require('../models/card');
const openai = require('openai')
const { Configuration, OpenAIApi } = openai;

const getDecks = async(req, res) => {
    try {
        const pipeline = [{ $group: { _id: '$deckName' } }];
        const deckNamesCursor = await Card.aggregate(pipeline);
        const deckNamesList = deckNamesCursor.map(deck => deck._id)
        res.status(200).json( { deckNamesList })
    } catch (error) {
        res.status(500).json( { msg: error } )
    }
}

const getDeckCards = async(req, res) => {
    try{
        const deckName = req.params.deckName;
        const cards = await Card.find({deckName: deckName});
        res.status(200).json({ cards })
    }
    catch (error) {
        res.status(500).json( { msg: error } )
    }
}

const createCard = async(req, res) => {
    try {
        const deckName = req.params.deckName;
        
        if (req.body.mode === "manual") {
            const { cardType: type, cardWord: word, ...content } = req.body
            console.log(deckName, content)
            const card = await Card.create( {
                deckName, type, word, ...content
            })
            res.status(201).json( { card } )
        } else {
            const openAI = new OpenAIApi( new Configuration({
                apiKey: process.env.OPENAI_API_KEY
                                }))
            const words = req.body.content;
            const question = words + `  : Use these words, and generate a JSON of objects containing the information that I will need for my flashcard app. I need to know which word type it is (noun, verb, adj, adverb, idiom, ...), the word itself, an array 4 objects {meaning of the word, usage of the word}, an array of 4 synonyms, and an array of 4 antonyms. To recap, the format should be: [{deckName: ${deckName}, type: type, word: word, meaning: [{meaning: meaning, example: usage}, +3 more], synonym: [4 synonyms], antonym: [4 antonyms]}, {the same for other words}]. Don't touch the deckName value pair, I want it as I gave to you. Your response should just be a pure JSON with no comments. I am using the data to store it in a database. !!!Please give me just the array. The array will be used to insert data to mongoose automatically. So, don't add any superfluous info. I won't be there to filter the unncessary comments.`
            console.log('start')
            const response = await openAI.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question}]
            })

            const generateData = response.data.choices[0].message.content;
            console.log('yes')
            const parseData = JSON.parse(generateData);
            Card.insertMany(parseData)
            .then(() => {
                console.log('saved')
                return res.status(201).json( { msg: 'successful' } );
                }
            ).catch( (error) => {
                return res.status(500).json({msg: error.message})
                }
            )
        }
        
    }
    catch (error) {
        res.status(500).json({msg: error.message})
    }
}

const deleteCards = async (req, res) => {
    try {
        console.log('anyy')
        const deckNames = req.params.deckName.split(',');
        console.log(deckNames)
        const cards = await Card.deleteMany({ deckName: { $in: deckNames }})
                        .then((deleteData) => {
                            return res.status(201).json( {msg: `${deleteData.deletedCount} cards deleted successfully`})
                        })
                        .catch( error => {return res.status(500).json( { msg: error.message })})
    } catch (error) {
        res.status(500).json( { msg : error.message })
    }
}

module.exports = {
    getDecks,
    getDeckCards,
    createCard,
    deleteCards
}