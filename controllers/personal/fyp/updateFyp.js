import UserTopicProgress from '../../../models/fyp/user.js';
import FypTopic from '../../../models/fyp/topic.js';


export default async (req, res) => {
    try {
        const { user, fypState } = req.body
        console.log(fypState)
        await updateFypExperience(user, fypState)
        res.status(200)
    } catch (error) {
        console.log(error)
    }
}

const updateFypExperience = async (userID, feedback) => {
    const topicScores = {};

    // Aggregate scores by topic
    for (const [wordID, { topicID, liked, saved }] of Object.entries(feedback)) {
        const score = (liked ? 1 : 0) + (saved ? 2 : 0);
        if (!topicScores[topicID]) {
            topicScores[topicID] = 0;
        }
        topicScores[topicID] += score;
    }

    const updates = [];

    for (const [topicID, score] of Object.entries(topicScores)) {
        updates.push(
            UserTopicProgress.findOneAndUpdate(
                { userID, topicID },
                { $inc: { score } },
                { upsert: true, new: true }
            )
        );

        updates.push(
            FypTopic.findOneAndUpdate(
                { topicID },
                { $inc: { score } },
                { upsert: true, new: true }
            )
        );
    }

    await Promise.all(updates);
};
