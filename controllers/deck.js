const DeckMetaData = require('../models/deckMetaData');
const Card = require('../models/card')

const createNewDeck = async (deckId, deckName, userId, cardNumber) => {
    try {
        let deck;
        if (deckId) {
            deck = await DeckMetaData.findById(deckId)
            deck.cardNumber += cardNumber
        }
        else {
            deck = new DeckMetaData({
                deckName,
                creator: userId,
                cardNumber,
                performance: {
                    correct: [0],
                    performance: [0],
                    time: [0]
                }
            });
        }

        deck = await deck.save();
        console.log('Deck metadata saved:');
        return deck
    } catch (error) {
        console.error('Error saving deck metadata:', error);
    }
    
}

const getDecks = async(req, res) => {
    try {
        const decks = await DeckMetaData.find();
        res.status(200).json(decks)
    } catch (error) {
        res.status(500).json({message: 'Error fetching decks', error});
    }
    // try {
    //     const pipeline = [{ $group: { _id: '$deckName' } }];
    //     const deckNamesCursor = await Card.aggregate(pipeline);
    //     const deckNamesList = deckNamesCursor.map(deck => deck._id)
    //     res.status(200).json( { deckNamesList })
    // } catch (error) {
    //     res.status(500).json( { msg: error } )
    // }
}

const getDeckMetaData = async (req, res) => {
    try {
        const deckName = req.params.deckName;
        const deckMetaData = await DeckMetaData.findOne({ deckName });
        return res.status(200).json( { deckMetaData })
    } catch (error) {
        res.status(500).json( { msg: error })
    }
}

const updateDeckMetaData = async (req, res) => {
    try {
        const deckName = req.params.deckName;
        let deckMetaData = await DeckMetaData.findOne({ deckName: deckName });
        if (!deckMetaData) {
            const perform = {
                correct : [req.body.correct], performance : [req.body.performance], time : [req.body.time]
            }
            const content = { deckName, performance : perform } 
            deckMetaData = await DeckMetaData.create(content);
            return res.status(201).json( { deckMetaData } )
        }
        // insert the results if exits
        
        deckMetaData = await DeckMetaData.updateOne(
            { deckName: deckName },
            {
                $push: {
                    'performance.correct': req.body.correct,
                    'performance.performance': req.body.performance,
                    'performance.time': req.body.time
                }
            }
        )
        return res.status(200).json({ msg: 'Perform items pushed successfully' })

    } catch (error) {
        //console.log(error)
        return res.status(500).json( { msg: error })
    }
}

const deleteDecks = async (req, res) => {
    try {
        const deckIds = req.params.deckName.split(',');
        // Delete all cards associated with the specified decks
        const deleteCardResult = await Card.deleteMany({ deck: { $in: deckIds } });
        console.log(`${deleteCardResult.deletedCount} cards deleted successfully`);

        // Delete the specified decks
        const deleteDeckResult = await DeckMetaData.deleteMany({ _id: { $in: deckIds } });
        console.log(`${deleteDeckResult.deletedCount} decks deleted successfully`);

        res.status(200).json({
            msg: `${deleteCardResult.deletedCount} cards and ${deleteDeckResult.deletedCount} decks deleted successfully`
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    createNewDeck,
    getDecks,
    getDeckMetaData,
    updateDeckMetaData,
    deleteDecks
};
