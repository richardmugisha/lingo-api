
import mongoose from "mongoose"

const wordMastery = new mongoose.Schema({
    word: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Word',
        unique: true
    },
    level: {
        type: Number,
        default: 0
    }
})

const learning = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    words: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Word'
        }
    ],
    chunkIndex: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 0
    }
})

learning.index({ user: 1, topic: 1 }, { unique: true });

const WordMastery = mongoose.model('WordMastery', wordMastery)
const Learning = mongoose.model('Learning', learning)

const masteryUpdation = async (wordMasteries) => {
    try {
        return await WordMastery.insertMany(wordMasteries, { ordered: false }); // ordered: false allows continuing on duplicates
    } catch (error) {
        if (error.code === 11000) {
            //console.log("Duplicate wordId found and skipped.");
        } else {
            throw error;
        }
    }

}

// const newLearning = async (topic, user, words) => {
//     const createdLearning = await Learning.create(
//         {
//             user, 
//             topic,
//             chunkIndex: 0,
//             level: 0,
//             words: words.slice(0, 10),
//         }
//     )

//     let wordMasteries = words.slice(0, 10)?.map(word => ({word, level: 0}))
//     wordMasteries = await masteryUpdation(wordMasteries)
//     // //console.log(createdLearning, wordMasteries, '............')

//     return {createdLearning: createdLearning.toObject(), wordMasteries}
// }

const newLearning = async (topic, user, words) => {
    const initialWords = words.slice(0, 10);

    const createdLearning = await Learning.findOneAndUpdate(
        { user, topic },
        {
            $setOnInsert: {
                chunkIndex: 0,
                level: 0,
                words: initialWords,
            }
        },
        { new: true, upsert: true } // creates only if not exists
    ).lean();

    let wordMasteries = initialWords.map(word => ({ word, level: 0 }));
    wordMasteries = await masteryUpdation(wordMasteries);

    return { createdLearning, wordMasteries };
};


const pushNewTopic = async (topicId, user, words) => {
    const updatedLearning = await Learning.findOneAndUpdate(
        {user}, 
        {$push: { topics: [{topicId, chunkIndex: 0, level: 0, words: words.slice(0, 10)}] } },
        { new: true}
    )

    let wordMasteries = words.slice(0, 10)?.map(word => ({word, level: 0}))
    wordMasteries = await masteryUpdation(wordMasteries)

    return { updatedLearning: updatedLearning.toObject(), wordMasteries }
}

const wordMasteryUpdate = async (wordMasteryList) => {
    console.log(wordMasteryList)
    const updatePromises = wordMasteryList.map(mastery => WordMastery.findOneAndUpdate({word: mastery.word}, {level: mastery.level}, {new: true} ) )
    const updatedWordMasteries = await Promise.all(updatePromises)
    return updatedWordMasteries
}


const patchLearningTopic = async (userId, updateData) => {
    const updatedLearning = await Learning.findByIdAndUpdate(
        updateData._id, // Correct: this is the Learning document's _id
        {
            words: updateData.words,
            chunkIndex: updateData.chunkIndex,
            level: updateData.level
        },
        { new: true }
    );

    if (!updatedLearning || updatedLearning.user.toString() !== userId.toString()) {
        throw new Error("Learning document not found or does not belong to the user.");
    }

    let wordMasteries;
    if (updateData.levelUp) {
        wordMasteries = updateData.words.slice(0, 10)?.map(word => ({ word, level: 0 }));
        wordMasteries = await masteryUpdation(wordMasteries);
    }

    return {
        updatedLearning: updatedLearning.toObject(),
        newWordMasteries: wordMasteries
    };
};


export {
    WordMastery,
    Learning,
    newLearning,
    wordMasteryUpdate,
    patchLearningTopic,
    pushNewTopic
}

