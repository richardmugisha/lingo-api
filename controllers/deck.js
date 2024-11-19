const Deck = require('../models/deck');
const getWordModel = require('../models/word/word')
const Story = require('../models/story');
const { fullStoryGen, aiCoEditor } = require('../utils/openai-process/storyGenerator')

const { Learning, WordMastery, newLearning, wordMasteryUpdate, patchLearningDeck, pushNewDeck }  = require('../models/learning/learning')

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
            });
        }
        return deck

    } catch (error) {
        console.error('Error creating or retrieving deck metadata:', error);
    }
    
}

const getDecks = async(req, res) => {
    const { creator, language:deckLang } = req.query;
    try {
        const filters = {};
        if (creator) filters.creator = creator;
        if (deckLang) filters.deckLang = deckLang;
        const decks = await Deck.find(filters);
        const existingLearning = (await Learning.findOne({ user: creator }))?.toObject()
        // console.log(decks)
        res.status(200).json({decks, userLearning: existingLearning || {}})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'Error fetching decks', error});
    }
    
}

const getDeck = async (req, res) => {
    const { deckId, userId } = req.query;
    try {
        const deck = await retrieveDeckInfo(deckId, userId)
        return res.status(200).json( { deck })
    } catch (error) {
        res.status(500).json( { msg: error })
    }
}
const retrieveDeckInfo = async (deckId, userId) => {
    console.log('deckId', deckId)
    try {
        let deck = (await Deck.findById(deckId));
        if (!deck) throw new Error('deck does not exist!')
        deck = deck.toObject()
        const WordModel = getWordModel(deck.deckLang)
        const deckWordIdList = deck.words
        deck.words = await WordModel.find( {'_id': {$in: deckWordIdList} })
        const existingLearning = (await Learning.findOne({ user: userId }))?.toObject()
        let createdLearning, wordMasteries, updatedLearning;
        if (!existingLearning) {
            ( { createdLearning, wordMasteries} = await newLearning(deckId, userId, deckWordIdList) )
        }
        else if (!existingLearning.decks.find(deck => deck.deckId.toString() === deckId)) {
            ( { updatedLearning, wordMasteries} = await pushNewDeck(deckId, userId, deckWordIdList) )
        }

        const learning = updatedLearning || existingLearning || createdLearning
        const learningDeck = learning?.decks?.find(deckHere => {if (deckHere.deckId.toString() === deckId) return {words: deckHere.words, performance: deckHere.performance, chunkIndex: deckHere.chunkIndex } }) || {}
        const learningWords = deck.words.filter( word => learningDeck.words?.some(wordId => wordId.equals(word._id)) )
        const learningWordMasteries = wordMasteries || await WordMastery.find({'wordId': {$in: learningDeck.words } })

        console.log(learningWords?.length, learningWordMasteries?.length, wordMasteries, await WordMastery.find({'wordId': {$in: learningDeck.words } }), '....end')
        deck.learning = {
            ...learningDeck,
            words: learningWords?.map((word, i) => ({...word.toObject(), level: learningWordMasteries[i] }) )
        }
        console.log(deck.learning)
        return deck
    } catch (error) {
        console.log(error, '---------------85')
        throw error
    }
}

const updateMastery = async (req, res) => {
    console.log(req.query)
    try {
        const { deckId, userId } = req.query
        const { wordsMasteriesList, deckLearnChunk } = req.body
        console.log(req.query, deckLearnChunk._id)
        const updatedMasteries = await wordMasteryUpdate(wordsMasteriesList)
        const { updatedLearning, newWordMasteries } = await patchLearningDeck(userId, deckLearnChunk)
        if (newWordMasteries && updatedLearning && updatedMasteries ) {
            const deck = await retrieveDeckInfo(deckId, userId)
            return res.status(200).json({ deck, msg: 'Mastery updated successfully, and user leveled up' })            
        }
        if (updatedMasteries && updatedLearning) {
            const deck = await retrieveDeckInfo(deckId, userId)
            return res.status(200).json({ deck, msg: 'Mastery updated successfully' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json( { msg: error })
    }
}

const deleteDecks = async (req, res) => {
    try {
        console.log('deleting................')
        const deckIds = req.query.deckIds.split(',');
        const deleteDeckResult = await Deck.deleteMany({ _id: { $in: deckIds } });
        console.log(`${deleteDeckResult.deletedCount} decks deleted successfully`);

        res.status(200).json({
            msg: `${deleteDeckResult.deletedCount} deck${deleteDeckResult.deletedCount && 's'} deleted successfully`
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
    try {
        if (aiAssistance === 'Ai co-editor') {
            const genStory = await aiCoEditor(title, summary, words, story);
            console.log(genStory)
            return res.json({story: genStory})
        }
        else if (aiAssistance === 'Ai for you') {
            const genStory = await fullStoryGen(title, summary, words)
            console.log(genStory);
            ({title, story} = genStory)
        }
        const storyTocreate = {story, title, words, deck: deckId}
        if (userId) storyTocreate.creator = userId
        console.log(deckId, userId, story)
    
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
    updateMastery,
    deleteDecks,
    createStory,
    getStories,
};
