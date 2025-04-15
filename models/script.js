
import mongoose from "mongoose"

const ScriptSchema = mongoose.Schema({
    writer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    coWriters: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
        required: false
    }],
    deck: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deck' 
    },
    details: [Object],
    title: String,
    summary: String,
    words: [String]
})

export default mongoose.model('Script', ScriptSchema);
