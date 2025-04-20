
import mongoose from "mongoose"

const StorySchema = mongoose.Schema({
    leadAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    coAuthors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic' 
    },
    details: [
        {
            sentence: String,
            blanked: String,
        }
    ],
    title: String,
    words: [String]
})

export default mongoose.model('Story', StorySchema);
