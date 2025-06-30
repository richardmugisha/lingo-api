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
    },
    details: {
        type: [
            {
                sentence: String,
                blanked: String,
                topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" }
            }
        ],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('Story', StorySchema);
