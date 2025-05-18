const Cardfrom '../models/card');
const { createNewTopic }from './topic')

const wordDefinitionfrom '../utils/openai-process/wordDefinition')

const getTopicCards = async (req, res) => {
    try {
        const topicId = req.params.topicName; // Retrieve topicId from request parameters
        const cards = await Card.find({ topic: topicId }); // Find cards by topicId
        res.status(200).json({ cards });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: error.message });
    }
};


const createCard = async(req, res) => {
    const testAI = false; //openai api not ready yet. When ready, let the content come from the client
    let topic;
    try {
        const {topicName }= req.params;
        const {userId, topicId, content, topicLang} = req.body
        
        const manualMode = req.body.mode === "manual"
        const cardNumber = manualMode ? 1 : content.split(',').length;
        //console.log(userId, topicId, topicName, cardNumber)
        // Check if topic metadata exists
        topic = await createNewTopic(topicId, topicName, userId, cardNumber, topicLang);
        if (!topic) throw new Error(`The topic with id: ${topicName} doesn't exist!`)
        if (manualMode) {
            const card = await Card.create( {
                topic : topic._id, ...content
            })
            topic.cardNumber = 1 + (topic.cardNumber || 0)
            topic.save()
            res.status(201).json( { topic, card } )
        } else {
            const parsedData = await wordDefinition(content, 'regular topic') // true is for testing
            const cards = parsedData.map(card => ({...card, topic: topic._id }))
            Card.insertMany(cards)
            topic.cardNumber = cards.length + (topic.cardNumber || 0)
            topic.save()
            .then(() => {
                return res.status(201).json( { topic } );
                }
            ).catch( (error) => {
                //console.log(error.message)
                return res.status(500).json({msg: error.message})
                }
            )
        }
        
    }
    catch (error) {
        //console.log(error.message)
        res.status(500).json({error: error.message, topic})
    }
}

const deleteCards = async (req, res) => {
    try {
        const topicIds = req.params.topicIds.split(',');
        const cards = await Card.deleteMany({ topicName: { $in: topicIds }})
                        .then((deleteData) => {
                            return res.status(201).json( {msg: `${deleteData.deletedCount} cards deleted successfully`})
                        })
                        .catch( error => {return res.status(500).json( { msg: error.message })})
    } catch (error) {
        res.status(500).json( { msg : error.message })
    }
}

export {
    getTopicCards,
    createCard,
    deleteCards
}
