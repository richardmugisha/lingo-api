import mongoose from "mongoose";

const UserTopicProgressSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    coveredWords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word'
    }],
    score: {
        type: Number,
        default: 0
    },
    archived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('UserTopicProgress', UserTopicProgressSchema);
