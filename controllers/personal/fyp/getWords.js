import getWordModel from "../../../models/word/word.js"
import Topic from "../../../models/topic.js";
import UserTopicProgress from "../../../models/fyp/user.js";
import FypTopic from "../../../models/fyp/topic.js";

// Helpers
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

// User-related word entries (with covered filtering)
const getUserWordEntries = async (userID) => {
    const progresses = await UserTopicProgress.find({ userID, archived: false });
    const topicIDs = progresses.map(p => p.topicID);
    const topicMap = Object.fromEntries(progresses.map(p => [p.topicID.toString(), p.coveredWords]));

    const topics = await Topic.find({ _id: { $in: topicIDs } });

    return topics.flatMap(topic => {
        const covered = new Set((topicMap[topic._id.toString()] || []).map(id => id.toString()));
        return topic.words
            .filter(wordID => !covered.has(wordID.toString()))
            .map(wordID => ({ topicID: topic._id, word: wordID }));
    });
};

// FYP-related word entries (NO exclusions here!)
const getFypWordEntries = async () => {
    const fypTopics = await FypTopic.findBestTopics(); // You can sort/prioritize inside here
    const topicIDs = fypTopics.map(fyp => fyp.topicID);
    const topics = await Topic.find({ _id: { $in: topicIDs } });

    return topics.flatMap(t => t.words.map(wordID => ({ topicID: t._id, word: wordID })));
};

// Random topics (NO exclusions!)
const getRandomWordEntries = async (wordLimit = 20) => {
    // Step 1: Get random topics that have words
    const candidateTopics = await Topic.aggregate([
        { $match: { words: { $exists: true, $not: { $size: 0 } } } },
        { $sample: { size: 3 } } // fewer topics, each with words
    ]);

    // Step 2: Extract a flat list of { topicID, word }
    const wordEntries = candidateTopics.flatMap(t =>
        t.words.map(wordID => ({ topicID: t._id, word: wordID }))
    );

    // Step 3: Shuffle and return only up to `wordLimit` entries
    return wordEntries.sort(() => 0.5 - Math.random()).slice(0, wordLimit);
};



// Exposed: Main orchestrator
const getWords = async (userID, limit = 20) => {
    const [userEntries, fypEntriesRaw, randomEntriesRaw] = await Promise.all([
        getUserWordEntries(userID),
        getFypWordEntries(),
        getRandomWordEntries()
    ]);

    // Extract covered words from user entries
    const coveredSet = new Set(userEntries.map(e => e.word.toString()));

    // Filter FYP and random entries to exclude already covered words
    const fypEntries = fypEntriesRaw.filter(e => !coveredSet.has(e.word.toString()));
    const randomEntries = randomEntriesRaw.filter(e => !coveredSet.has(e.word.toString()));

    // Merge with prioritization: user > fyp > random
    const seen = new Set();
    const deduped = [];

    const prioritize = (entries) => {
        for (const entry of entries) {
            const id = entry.word.toString();
            if (!seen.has(id)) {
                seen.add(id);
                deduped.push(entry);
            }
        }
    };

    prioritize(userEntries);
    prioritize(fypEntries);
    prioritize(randomEntries);

    // Trim to requested limit
    const limited = deduped.slice(0, limit);
    const wordIDs = limited.map(e => e.word);

    const WordModel = getWordModel("english");
    const wordDocs = await WordModel.find({ _id: { $in: wordIDs } });
    const wordMap = Object.fromEntries(wordDocs.map(w => [w._id.toString(), w]));

    // Update coveredWords progress
    addCoveredWords(userID, limited);

    // Return shuffled final output
    return shuffleArray(limited.map(({ topicID, word }) => ({
        topicID,
        word: wordMap[word.toString()],
    })));
};

export default getWords;

const addCoveredWords = async (userID, wordEntries) => {
    const topicGroups = {};

    for (const { topicID, word } of wordEntries) {
        const tID = topicID.toString();
        if (!topicGroups[tID]) topicGroups[tID] = [];
        topicGroups[tID].push(word);
    }

    const updates = Object.entries(topicGroups).map(async ([topicID, wordIDs]) => {
        await UserTopicProgress.findOneAndUpdate(
            { userID, topicID },
            { $addToSet: { coveredWords: { $each: wordIDs } } },
            { upsert: true }
        );
    });

    await Promise.all(updates);
};
