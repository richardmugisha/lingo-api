
import mongoose from "mongoose"

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
            word: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Word',
                required: true
            },
            level: {
                type: Number,
                default: 0
            }
        }
    ],
    chunkIndex: {
        type: Number,
        default: 0
    },
    chunkLevel: {
        type: Number,
        default: 0
    },
    topicLevel: {
        type: Number,
        default: 0
    }
});


learning.index({ user: 1, topic: 1 }, { unique: true });

const Learning = mongoose.model('Learning', learning)

const newLearning = async (topic, user, wordIds) => {
    const initialWords = wordIds.slice(0, 10);

    // Directly embed word masteries into the learning document
    const wordMasteries = initialWords.map(wordId => ({
        word: wordId,
        level: 0
    }));

    // Create the Learning document with embedded word masteries
    const createdLearning = await Learning.create({
        user,
        topic,
        words: wordMasteries
    });

    return createdLearning;
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
      updateData._id,
      {
        words: updateData.words,
        chunkIndex: updateData.chunkIndex,
        chunkLevel: updateData.chunkLevel,
        topicLevel: updateData.topicLevel
      },
      { new: true }
    );
  
    // Ensure it's the correct user
    if (!updatedLearning || updatedLearning.user.toString() !== userId.toString()) {
      throw new Error("Learning document not found or does not belong to the user.");
    }
  
    return {
      updatedLearning: updatedLearning.toObject()
    };
};
  



export {
    Learning,
    newLearning,
    wordMasteryUpdate,
    patchLearningTopic,
    pushNewTopic
}

