
const mongoose = require('mongoose')

const StorySchema = mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeckMetaData',
        required: [true, 'must provide deck name']
    },
    story: {
        type: String,
        required: [true, 'must provide a story']
    },
    title: {
        type: String,
        required: [true, 'must provide the title of the story']
    }
})

module.exports = mongoose.model('Story', StorySchema);
