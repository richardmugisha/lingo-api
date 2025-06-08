import mongoose from "mongoose";

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

    outline: {
        type: String,
        default: ""
    }
}, { timestamps: true })

export default mongoose.model('Story', StorySchema);
