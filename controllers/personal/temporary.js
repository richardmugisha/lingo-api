import Temporary from "../../models/temporary.js"
import Topic from "../../models/topic.js"
import Card from "../../models/card.js"

import wordDefinition from "../../utils/openai-process/wordDefinition.js"

const updateTemporary = async (req, res) => {
    try {
        const { userId, words } = req.body;
        let thisUserTemporaryTopic = await Temporary.findOne({ creator: userId });
        if (!thisUserTemporaryTopic) {
            thisUserTemporaryTopic = new Temporary({ 
                creator: userId, 
                cardNumber: 0
            });
        } 

        const unprocessed = [...words, ...thisUserTemporaryTopic.unprocessed]
        thisUserTemporaryTopic.unprocessed = unprocessed;
        await thisUserTemporaryTopic.save()
        
        const userTempCards = await Card.find({ topic: thisUserTemporaryTopic._id });
        res.status(200).json({ unprocessed: thisUserTemporaryTopic.unprocessed, processed: userTempCards, tempId: thisUserTemporaryTopic._id });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTemporary = async(req, res) => {
    const { tempId } = req.params;
    //console.log(tempId)
    const thisUserTemporaryTopic = await Temporary.findById(tempId);
    try {
        const parseData = await wordDefinition(thisUserTemporaryTopic.unprocessed, 'temporary topic')
        const cards = parseData.map(card => ({...card, topic: tempId }))
        await Card.insertMany(cards)
        thisUserTemporaryTopic.cardNumber += thisUserTemporaryTopic.unprocessed.length
        thisUserTemporaryTopic.unprocessed = [];
        await thisUserTemporaryTopic.save()
        const userTempCards = await Card.find({ topic: thisUserTemporaryTopic._id });
        
        res.status(200).json({ unprocessed: thisUserTemporaryTopic.unprocessed, processed: userTempCards, tempId });
    } catch (error) {
        //console.log(error.message)
        res.status(500).json({ error: error.message });
    }
}

const stealFromTemporary = async (req, res) => {
    let { userId, idType, id, selected, topicLang } = req.body;

    const tempTopic = await Temporary.findOne({ creator: userId })

    const topic = idType === 'topicId' ? await Topic.findById(id) : 
        new Topic({
            topicName: id,
            topicLang,
            creator: userId,
            cardNumber: 0,
            performance: {
                correct: [0],
                performance: [0],
                time: [0]
            }
        });
    
    id = topic._id
    
    try {
        // Update the topic field for all selected card ids
        await Card.updateMany(
            { _id: { $in: selected } }, // Find cards whose _id is in the selected array
            { $set: { topic: id } } // Set the topic field to the new id
        );
        topic.cardNumber += selected.length;
        tempTopic.cardNumber -= selected.length;
        await topic.save();
        await tempTopic.save()

        res.status(200).json({ message: 'Cards updated successfully', id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {
    updateTemporary,
    getTemporary,
    stealFromTemporary
};
