import mongoose from "mongoose"

const ChapterWordSchema = mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    word: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
    }
})

const ChapterSchema = mongoose.Schema({
    story: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story',
    },
    words: {
        type: [ ChapterWordSchema ],
        default: []
    },
    details: {
        type: [
            {
                sentence: String,
                blanked: String,
            }
        ],
        default: []
    }
}, { timestamps: true })

export default mongoose.model('Chapter', ChapterSchema);

