const mongoose = require('mongoose');

const Deck = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'Must provide deck name']
    },

    deckLang: {
        type: String,
        required: [true, 'Must provide deck language']
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    words: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }
    ],
    performance: {
        correct: {
            type: [Number],
            required: [true, 'Must provide correct ratio']
        },
        performance: {
            type: [Number],
            required: [true, 'Must provide performance ratio']
        },
        time: {
            type: [Number],
            required: [true, 'Must provide time taken']
        }
    }
});

module.exports = mongoose.model('Deck', Deck);
