
const mongoose = require('mongoose')

const StorySchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck',
        required: [true, 'must provide deck name']
    },
    story: [
        {
            sentence: String,
            blanked: String,
        }
    ],
    title: String,
    words: [String]
})

module.exports = mongoose.model('Story', StorySchema);
