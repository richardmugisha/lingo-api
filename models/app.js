const mongoose = require('mongoose');

const AppSchema = new mongoose.Schema({
    timePerCard: { type: [Number], required: [true, 'how long did the openai process take?']},
    max_wishes: { type: Number, default: 5 },
    new_words_to_add: {
        type: Map,
        of: [
            {
                creator: { type: mongoose.Types.ObjectId, ref: 'User' },
                deck: { type: mongoose.Types.ObjectId, ref: 'Deck' },
                words: { 
                    type: [{
                        word: String,
                        example: String
                    }], 
                    default: [] 
                } // Array of words as strings
            }
        ],
        default: {}
    }
});

module.exports = mongoose.model('App', AppSchema);
