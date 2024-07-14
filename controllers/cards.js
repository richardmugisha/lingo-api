const Card = require('../models/card');
const { createNewDeck } = require('./deck')

const { openaiProcess } = require('../utils/openaiProcess')

const getDeckCards = async (req, res) => {
    try {
        const deckId = req.params.deckName; // Retrieve deckId from request parameters
        const cards = await Card.find({ deck: deckId }); // Find cards by deckId
        res.status(200).json({ cards });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};


const createCard = async(req, res) => {
    const testAI = false; //openai api not ready yet. When ready, let the content come from the client
    let deck;
    try {
        const {deckName }= req.params;
        const {userId, deckId, content} = req.body
        
        const manualMode = req.body.mode === "manual"
        const cardNumber = manualMode ? 1 : testAI ? 7: content.length;
        console.log(userId, deckId, deckName, cardNumber)
        // Check if deck metadata exists
        deck = await createNewDeck(deckId, deckName, userId, cardNumber);

        if (manualMode) {
            const card = await Card.create( {
                deck : deck._id, ...content
            })
            res.status(201).json( { deck, card } )
        } else {
            const words = content;
            const parseData = await openaiProcess(words, 'regular deck', testAI) // true is for testing
            const cards = parseData.map(card => ({...card, deck: deck._id }))
            Card.insertMany(cards)
            .then(() => {
                return res.status(201).json( { deck } );
                }
            ).catch( (error) => {
                return res.status(500).json({msg: error.message})
                }
            )
        }
        
    }
    catch (error) {
        console.log(error)
        res.status(500).json({error: error.message, deck})
    }
}

const deleteCards = async (req, res) => {
    try {
        const deckIds = req.params.deckIds.split(',');
        const cards = await Card.deleteMany({ deckName: { $in: deckIds }})
                        .then((deleteData) => {
                            return res.status(201).json( {msg: `${deleteData.deletedCount} cards deleted successfully`})
                        })
                        .catch( error => {return res.status(500).json( { msg: error.message })})
    } catch (error) {
        res.status(500).json( { msg : error.message })
    }
}

module.exports = {
    getDeckCards,
    createCard,
    deleteCards
}
