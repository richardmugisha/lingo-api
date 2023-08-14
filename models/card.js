const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'must provide deck name']
    },
    word: {
        type: String,
        required: [true, 'must provide the word item']
    },
    type: {
        type: String,
        required: [true, 'must provide the word type']
    },
    meaning: {
        type: Array,
        required: [true, 'must provide meanings and examples']
    },
    synonym: {
        type: Array,
        required: [true, 'must provide synonyms']
    },
    antonym: {
        type: Array,
        required: [true, 'must provide antonyms']
    }
})

module.exports = mongoose.model('Card', CardSchema)
