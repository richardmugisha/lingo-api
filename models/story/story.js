import mongoose from "mongoose";

const StorySceneSChema = mongoose.Schema({
    text: {type: String, default: ""} ,
    imageUrl: String,
    topics: {
                type: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Topic',
            }],
             default: []
    }
})

const OutlineSchema = mongoose.Schema({
    general: { type: String, default: ""},
    brainDump: { type: String, default: ""},
    chapters: [{
        outline: { type: String, default: ""},
        scenes: [String]
    }]
})

const StorySchema = mongoose.Schema({
    title: { type: String, default: "Untitled Story"},
    imageUrl: { type: String, default: "" },
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
        type: OutlineSchema,
        default: { general: "", chapters: []}
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
