const mongoose = require('mongoose');

const DeckMetaDataSchema = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'Must provide deck name']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cardNumber: {
        type: Number,
        required: [true, 'How many cards are in this deck']
    },
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

module.exports = mongoose.model('DeckMetaData', DeckMetaDataSchema);
