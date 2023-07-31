const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    deckName: {
        type: String,
        required: [true, 'must provide deck name']
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
        type: Array,
        required: [true, 'must provide meanings and examples']
    },
    synonym: {
        type: Array,
        required: [true, 'must provide synonyms']
    },
    antonym: {
        type: Array,
        required: [true, 'must provide antonyms']
    }
})

module.exports = mongoose.model('Card', CardSchema)

/*
{
  "word": "solace",
  "type": "noun",
  "meaning": [
      {
        "meaning": "travailler dans les bous",
        "example": "never give up"
      },
      {
        "meaning": "travailler dans les bous",
        "example": "never give up"
      }
    ],
  "synonym": ["race", "ethny"],
  "antonym": ["work", "hard"]
}
*/