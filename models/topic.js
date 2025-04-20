import mongoose from "mongoose";

const Topic = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Must provide topic name']
    },

    language: {
        type: String,
        required: [true, 'Must provide topic language']
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Must provide the creator of the topic"]
    },
    
    words: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }
    ],
    isAiGenerated: {
        type: Boolean,
        default: false
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        default: null
    }
});

export default mongoose.model('Topic', Topic);
