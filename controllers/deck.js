const Deck = require('../models/deck');
const getWordModel = require('../models/word/word')
const Story = require('../models/story');
const { fullStoryGen, aiCoEditor } = require('../utils/openaiProcess')

const createNewDeck = async (deckId, deckName, userId, deckLang) => {
    try {
        let deck;
        if (deckId) {
            deck = await Deck.findById(deckId)
        }
        else {
            deck = new Deck({
                deckName,
                creator: userId,
                deckLang,
                words: [],
                performance: {
                    correct: [0],
                    performance: [0],
                    time: [0]
                }
            });
        }
        return deck

    } catch (error) {
        console.error('Error creating or retrieving deck metadata:', error);
    }
    
}

const getDecks = async(req, res) => {
    const { creator, language:deckLang } = req.params;
    // console.log('creator: ', creator, 'language: ', deckLang, 'none')
    try {
        const filters = {};
        if (creator !== 'all') filters.creator = creator;
        if (deckLang !== 'all') filters.deckLang = deckLang;
        const decks = await Deck.find(filters);
        // console.log(decks)
        res.status(200).json(decks)
    } catch (error) {
        res.status(500).json({message: 'Error fetching decks', error});
    }
    
}

const getDeck = async (req, res) => {
    try {
        const { deckId } = req.params;
        // console.log('deckId', deckId)
        const deck = await Deck.findById(deckId);
        if (!deck) throw new Error('deck does not exist!')
        const WordModel = getWordModel(deck.deckLang)
        deck.words = await WordModel.find( {'_id': {$in: deck.words} })
        // console.log(deck)
        return res.status(200).json( { deck })
    } catch (error) {
        console.log(error)
        res.status(500).json( { msg: error })
    }
}

const updateDeck = async (req, res) => {
    try {
        const deckId = req.params.deckId;
        let deck = await Deck.findById(deckId);
        if (!deck) {
            const perform = {
                correct : [req.body.correct], performance : [req.body.performance], time : [req.body.time]
            }
            const content = { deckName, performance : perform } 
            deck = await Deck.create(content);
            return res.status(201).json( { deck } )
        }
        // insert the results if exits
        
        deck = await Deck.findByIdAndUpdate(
            deckId,
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
        const deckIds = req.params.deckId.split(',');
        // // Delete all cards associated with the specified decks
        // const deleteCardResult = await Card.deleteMany({ deck: { $in: deckIds } });
        // console.log(`${deleteCardResult.deletedCount} cards deleted successfully`);

        // Delete the specified decks
        const deleteDeckResult = await Deck.deleteMany({ _id: { $in: deckIds } });
        console.log(`${deleteDeckResult.deletedCount} decks deleted successfully`);

        res.status(200).json({
            msg: `${deleteDeckResult.deletedCount} decks deleted successfully`
        });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
};

const createStory = async(req, res) => {
    const { deckId } = req.params;
    let {userId, story, title, words, aiAssistance, summary} = req.body;
    console.log(userId, story, title, words, aiAssistance, summary, '...creating story')
    if (aiAssistance === 'Ai co-editor') {
        const genStory = await aiCoEditor(title, summary, words, story);
        console.log(genStory)
        return res.json({story: genStory})
    }
    else if (aiAssistance === 'Ai for you') {
        const genStory = await fullStoryGen(title, summary, words)
        console.log(genStory)
        ({title, story} = genStory)
    }
    const storyTocreate = {story, title, words, deck: deckId}
    if (userId) storyTocreate.creator = userId
    console.log(deckId, userId, story)
    try {
        const createdStory = await Story.create(storyTocreate)
        console.log(createdStory)
        res.status(200).json({story: createdStory})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

const getStories = async(req, res) => {
    const { deckId } = req.params;
    try {
        const stories = await Story.find({ deck: deckId })
        console.log(stories)
        res.status(200).json({ stories })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ msg: error.message });
    }
}

module.exports = {
    createNewDeck,
    getDecks,
    getDeck,
    updateDeck,
    deleteDecks,
    createStory,
    getStories,
};
