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

    typeSettings: {
        type: Object,
        default: {
            fontFamily: "Roboto, sans-serif",
            fontSize: 16,
            lineHeight: 1.5
        }
    },

    pageSettings: {
        type: [
            {
                offset: Number,
                size: Number,
                sceneSettings: {
                    type: [{
                        offset: Number,
                        size: Number
                    }],
                    default: []
                }
            }
        ],
        default: [
            {
                offset: 0,
                size: 2, 
                sceneSettings: [
                    {
                        offset: 0, 
                        size: 2 // contains the title of the chapter, and the title of its first scene
                    }
                ]
            }
        ]
    },

    details: {
        type: [
            {
                sentence: String,
                blanked: String,
                topic: { type: mongoose.Schema.Types.ObjectId, ref: "Topic" },
                typeSettings: {
                    type: Object, /*fontFamily: "Roboto, sans-serif",
                    fontSize: 16,
                    lineHeight: 1.5*/
                }, 
            }
        ],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('Story', StorySchema);
