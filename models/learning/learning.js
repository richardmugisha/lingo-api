
const mongoose = require('mongoose')

const wordMastery = new mongoose.Schema({
    wordId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    },
    level: {
        type: Number,
        default: 0
    }
})

const learning = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    decks: [
        {
            deckId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Deck'
            },
            words: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Word'
                }
            ],
            chunkIndex: {
                type: Number,
                default: 0
            },
            level: {
                type: Number,
                default: 0
            }
        }
    ],
    unifiedDeck: {
        words: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }],
        level: {
            type: Number,
            default: 0
        } 
    }
})

const WordMastery = mongoose.model('WordMastery', wordMastery)
const Learning = mongoose.model('Learning', learning)

const newLearning = async (deckId, user, wordIds) => {
    const createdLearning = await Learning.create(
        {
            user, 
            decks: [{deckId, chunkIndex: 0, level: 0, words: wordIds.slice(0, 10)}],
            unifiedDeck: {
                words: wordIds.slice(0, 10),
                level: 0
            }
        }
    )

    let wordMasteries = wordIds.slice(0, 10)?.map(wordId => ({wordId, level: 0}))
    wordMasteries = await WordMastery.insertMany(wordMasteries)

    // console.log(createdLearning, wordMasteries, '............')

    return {createdLearning: createdLearning.toObject(), wordMasteries}
}

module.exports = {
    WordMastery,
    Learning,
    newLearning
}

