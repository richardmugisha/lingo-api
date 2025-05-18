import mongoose from "mongoose";

const ScriptSchema = new mongoose.Schema({
    script: {
        type: mongoose.Schema.ObjectId,
        ref: 'Script',
    },
    topics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }],
    done: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TopicScriptGroup = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: [true, 'Must provide the main topic']
    },

    scripts: [ScriptSchema],

    usedTopics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    }]
});

export default mongoose.model('TopicScriptGroup', TopicScriptGroup);
