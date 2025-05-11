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
    type: {
        type: String,
        enum: ['narration', 'line'],
        required: true
    },
    line: String,
    paraphrased: String,
}, { _id: false });

const SceneSchema = mongoose.Schema({
    title: String,
    logline: String,
    words: [ String ], // key words
    details: {
        type: [ SceneDetailSchema ],
        default: []
    }
}, { _id: false })

const ActSchema = mongoose.Schema({
    title: String,
    logline: String,
    scenes: [ SceneSchema ]
}, { _id: false })


const EpisodeSchema = mongoose.Schema({
    title: String,
    topic: String,
    logline: String,
    words: [String],
    acts: {
        type: [ ActSchema ],
        default: []
    }
}, { _id: false })

// Asset Schemas
const AssetSchema = mongoose.Schema({
    name: String,
    identity: String,
    summary: String,
    history: String,
    recent: String,
    relationships: String
}, { _id: false });

const AssetsSchema = mongoose.Schema({
    people: {
        type: [AssetSchema],
        default: []
    },
    objects: {
        type: [AssetSchema],
        default: []
    },
    places: {
        type: [AssetSchema],
        default: []
    },
    events: {
        type: [AssetSchema],
        default: []
    },
    abstract: {
        type: [AssetSchema],
        default: []
    }
}, { _id: false });

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
    title: String,
    summary: String,
    theme: String,
    genre: String,
    tone: String,
    mainCharacter: String,
    episodes: [EpisodeSchema],
    characters: [CharacterSchema],
    assets: {
        type: AssetsSchema,
        default: {
            people: [],
            objects: [],
            places: [],
            events: [],
            abstract: []
        }
    }
});

export default mongoose.model('Script', ScriptSchema);
