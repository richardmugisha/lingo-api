import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TopicMetaData',
        required: [true, 'must provide topic name']
    },
    'root word': {type: String,required: [true, 'must provide the word item']},
    variations: [
        {
            variationType: {type: String, required: [true, 'must provide the type of the variation type']},
            variationWord: {type: String, required: [true, 'must provide the type of the variation']},
            'language style': {type: String, required: [true, 'must define whether the word is formal or informal']},
            meaning: {type: String, required: [true, 'must provide meanings'] },
            example: {type: String, required: [true, 'must provide examples']},
            wordReferenceInExample: {type: String, required: [true, 'must provide the word reference in the example']},
            synonym: {type: String, required: [true, 'must provide synonyms']},
            antonym: {type: String, required: [true, 'must provide antonyms']}
        }
            
    ]
})

export default mongoose.model('Card', CardSchema)


/*
const CardSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: [true, 'must provide topic name']
    },
    word: {
        type: String,
        required: [true, 'must provide the word item']
    },
    type: {
        type: String,
        required: [true, 'must provide the word type']
    },
    
    meaning: {
        type: String,
        required: [true, 'must provide meanings and examples']
    },
    synonym: {
        type: String,
        required: [true, 'must provide synonyms']
    },
    antonym: {
        type: String,
        required: [true, 'must provide antonyms']
    }
})
*/