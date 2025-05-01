import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema({
    topicID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
        required: [true, 'Must provide topic name']
    },
    score: {
        type: Number,
        required: [true, "Must provide topic score"],
        default: 0
    }
});

// Define a static method on the schema to find highest scoring topics
// In models/fyp/topic.js
TopicSchema.statics.findBestTopics = function(limit = 5) {
    return this.find().sort({ score: -1 }).limit(limit);
};


const FypTopic = mongoose.model('FypTopic', TopicSchema);

export default FypTopic;
