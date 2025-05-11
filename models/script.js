import mongoose from "mongoose";

const RelationshipSchema = mongoose.Schema({
    type: String, // e.g., "friend", "enemy", "sibling", "love interest"
    to: String    // firstName or 'all'
}, { _id: false }); // no extra id for subdocuments

const CharacterSchema = mongoose.Schema({
    name: String,
    sex: String,
    ethnicity: String,
    age: Number,
    description: String,
    relationships: [RelationshipSchema]
}, { _id: false }); // no extra id for subdocuments

const SceneDetailSchema = mongoose.Schema({
    character: String,
    type: String, // narration or line
    line: String,
    paraphrased: String,
});

const SceneSchema = mongoose.Schema({
    title: String,
    logline: String,
    words: [ String ], // key words
    details: [ SceneDetailSchema ]
})

const ActSchema = mongoose.Schema({
    title: String,
    logline: String,
    scenes: [ SceneSchema ]
})

const EpisodeSchema = mongoose.Schema({
    title: String,
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    logline: String,
    acts: [ ActSchema ]
})

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
    theme: String,
    tone: String,
    mainCharacter: String,
    episodes: [EpisodeSchema],
    characters: [CharacterSchema],
    words: [String]
});

export default mongoose.model('Script', ScriptSchema);
