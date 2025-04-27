import mongoose from "mongoose";

const RelationshipSchema = mongoose.Schema({
    type: String, // e.g., "friend", "enemy", "sibling", "love interest"
    to: String    // firstName or 'all'
}, { _id: false }); // no extra id for subdocuments

const CharacterSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    isMain: {
        type: Boolean,
        default: false
    },
    sex: String,
    ethnicty: String,
    age: Number,
    personality: String,
    motivation: String,
    relationships: [RelationshipSchema]
}, { _id: false }); // no extra id for subdocuments

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
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    details: [Object],
    title: String,
    summary: String,
    characters: [CharacterSchema],
    words: [String]
});

export default mongoose.model('Script', ScriptSchema);
