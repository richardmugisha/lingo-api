import mongoose from "mongoose";

const StorySceneSChema = mongoose.Schema({
    text: {type: String, default: ""} ,
    topics: {
                type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Topic',
            }],
             default: []
    }
})

const StorySchema = mongoose.Schema({
    title: { type: String, default: "Untitled Story"},
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

    typeSettings: {
        type: Object,
        default: {
            fontFamily: "Roboto, sans-serif",
            fontSize: 16,
            lineHeight: 1.5
        }
    },

    chapters: [{
        _id: false,
        title: String,
        scenes: [{
            _id: false,
            title: { type: String, default: "Untitled Scene" },
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'StoryScene'
            }
        }]
    }],
}, { timestamps: true })

export default mongoose.model('Story', StorySchema);
export const Scene = mongoose.model('StoryScene', StorySceneSChema)
