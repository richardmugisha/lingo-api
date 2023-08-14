const mongoose = require('mongoose');

const DeckMetaDataSchema = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'must provide deck name']
    },
    
    performance: {
        correct: {
            type: Array,
            required: [true, 'must provide correct ratio']
        },
        performance: {
            type: Array,
            required: [true, 'must provide performance ratio']
        },
        time: {
            type: Array,
            required: [true, 'must provide time taken']
        }
    }
})

module.exports = mongoose.model('DeckMetaData', DeckMetaDataSchema)