require('dotenv').config()

const OpenAI = require('openai')

const openai = new OpenAI({apiKey: process.OPENAI_API_KEY});

const openaiProcess = async (words, regularOrTemporaryDeck, testing) => {
    try {
        const prompt = promptMaker(JSON.stringify(words), regularOrTemporaryDeck)
        const chatCompletion = testing ? null : await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt}]
        })
        const generateData = testing ? null : chatCompletion.choices[0].message.content;
        // console.log(generateData)
        const toReturn = testing ? gen : JSON.parse(generateData);
        return toReturn

    } catch (error) {
        throw new Error(error)
    }
}


const promptMaker = (words, regularOrTemporaryDeck) => {
    const regular = regularOrTemporaryDeck === 'regular deck'
    return `1. Use the list of ${regular ? 'words' : '{word, context} objects'} am about to give you, and generate a list of JSON objects containing the information that I will need for my flashcard app. Each word might be a root word, a phrasal verb, an expression,..., and I need a bunch of variations based on the root word (compute the most basic root word you can get. e.g: if the given word is a verb, the root word should not be conjugated), the variations will be picked from noun, verb, phrasal verb, adjective, adverb, idiom, proverb. You should give me as many variations of the root word as you can. Each variation has to have a style among formal, informal, colloquial, slang, jargon. Then each variation has a meaning, an example, a synonym and antonym. ${regular ? 'One of the variations should  as example, the context that came with the word at each instance.' : ''}
        The words : [${words}] 
                            A typical object will be: 
                                {
                                    "root word": put,
                                    variations: [
                                        variationType: "verb",
                                        variationWord: "the variation of the root word",
                                        "language style": "formal"
                                        "meaning": "The meaning",
                                        "example": "An example",
                                        "wordReferenceInExample": "Strictly copy here as is the part in the example that references the variationWord"
                                        "synonym": "A synonym",
                                        "antonym": "An antonym"
                                    ]
                                }
            2. I cannot stress enough how much important it is that the wordReferenceInExample should be inside the example given to you or the example you give. For example articulate inside "She articulated her words perfectly"
            3. Strictly respect the object keys I gave you. You can only change the values.
            4. Don't give me anything apart from a javaScript array because when I run JSON.parse(yourResult), it would throw an error
            5. The values for all the keys are required because they are also required per my database schema`
        }

const gen = [
    {
        "root word": "laugh",
        "variations": [
            {
                "variationType": "noun",
                "variationWord": "laughter",
                "language style": "formal",
                "meaning": "The action or sound of laughing",
                "example": "Her laughter was infectious.",
                "wordReferenceInExample": "laughter",
                "synonym": "giggle",
                "antonym": "crying"
            },
            {
                "variationType": "verb",
                "variationWord": "laugh",
                "language style": "informal",
                "meaning": "To make sounds with the voice that show amusement",
                "example": "He laughed at the joke.",
                "wordReferenceInExample": "laughed",
                "synonym": "chuckle",
                "antonym": "weep"
            },
            {
                "variationType": "adjective",
                "variationWord": "laughable",
                "language style": "colloquial",
                "meaning": "So ridiculous as to be amusing",
                "example": "His excuse was laughable.",
                "wordReferenceInExample": "laughable",
                "synonym": "ridiculous",
                "antonym": "serious"
            }
        ]
    },
    {
        "root word": "take",
        "variations": [
            {
                "variationType": "verb",
                "variationWord": "take",
                "language style": "formal",
                "meaning": "Lay hold of (something) with one's hands; reach for and hold",
                "example": "Please take the book from the shelf.",
                "wordReferenceInExample": "take",
                "synonym": "grab",
                "antonym": "give"
            },
            {
                "variationType": "phrasal verb",
                "variationWord": "take off",
                "language style": "informal",
                "meaning": "To leave the ground and begin to fly",
                "example": "The plane took off on time.",
                "wordReferenceInExample": "took off",
                "synonym": "depart",
                "antonym": "land"
            },
            {
                "variationType": "noun",
                "variationWord": "takeaway",
                "language style": "colloquial",
                "meaning": "A key fact, point, or idea to be remembered, typically one emerging from a discussion or meeting",
                "example": "The main takeaway from the meeting is the need for more training.",
                "wordReferenceInExample": "takeaway",
                "synonym": "summary",
                "antonym": "detail"
            }
        ]
    },
    {
        "root word": "make",
        "variations": [
            {
                "variationType": "verb",
                "variationWord": "make",
                "language style": "formal",
                "meaning": "Form (something) by putting parts together or combining substances",
                "example": "She made a cake.",
                "wordReferenceInExample": "made",
                "synonym": "create",
                "antonym": "destroy"
            },
            {
                "variationType": "noun",
                "variationWord": "maker",
                "language style": "informal",
                "meaning": "A person or thing that makes or produces something",
                "example": "He is a famous film maker.",
                "wordReferenceInExample": "maker",
                "synonym": "creator",
                "antonym": "destroyer"
            },
            {
                "variationType": "adjective",
                "variationWord": "makeable",
                "language style": "colloquial",
                "meaning": "Capable of being made or achieved",
                "example": "That goal is makeable.",
                "wordReferenceInExample": "makeable",
                "synonym": "achievable",
                "antonym": "impossible"
            }
        ]
    },
    {
        "root word": "keep",
        "variations": [
            {
                "variationType": "verb",
                "variationWord": "keep",
                "language style": "formal",
                "meaning": "Have or retain possession of",
                "example": "She decided to keep the money.",
                "wordReferenceInExample": "keep",
                "synonym": "retain",
                "antonym": "lose"
            },
            {
                "variationType": "noun",
                "variationWord": "keeper",
                "language style": "informal",
                "meaning": "A person who manages or looks after something or someone",
                "example": "He is the keeper of the lighthouse.",
                "wordReferenceInExample": "keeper",
                "synonym": "guardian",
                "antonym": "neglector"
            },
            {
                "variationType": "adjective",
                "variationWord": "kept",
                "language style": "colloquial",
                "meaning": "Maintained in a specified condition",
                "example": "Well-kept gardens are beautiful.",
                "wordReferenceInExample": "kept",
                "synonym": "maintained",
                "antonym": "neglected"
            }
        ]
    },
    {
        "root word": "work",
        "variations": [
            {
                "variationType": "noun",
                "variationWord": "work",
                "language style": "formal",
                "meaning": "Activity involving mental or physical effort done in order to achieve a purpose or result",
                "example": "Her work is highly regarded.",
                "wordReferenceInExample": "work",
                "synonym": "labor",
                "antonym": "leisure"
            },
            {
                "variationType": "verb",
                "variationWord": "work",
                "language style": "informal",
                "meaning": "To be engaged in physical or mental activity in order to achieve a result",
                "example": "He works as a teacher.",
                "wordReferenceInExample": "works",
                "synonym": "labor",
                "antonym": "relax"
            },
            {
                "variationType": "adjective",
                "variationWord": "workable",
                "language style": "colloquial",
                "meaning": "Capable of being done or put into practice successfully",
                "example": "This plan is workable.",
                "wordReferenceInExample": "workable",
                "synonym": "feasible",
                "antonym": "impractical"
            }
        ]
    },
    {
        "root word": "think",
        "variations": [
            {
                "variationType": "verb",
                "variationWord": "think",
                "language style": "formal",
                "meaning": "To have a particular opinion, belief, or idea about someone or something",
                "example": "I think he is honest.",
                "wordReferenceInExample": "think",
                "synonym": "believe",
                "antonym": "doubt"
            },
            {
                "variationType": "noun",
                "variationWord": "thinker",
                "language style": "informal",
                "meaning": "A person who thinks deeply and seriously",
                "example": "He is a great thinker.",
                "wordReferenceInExample": "thinker",
                "synonym": "philosopher",
                "antonym": "ignoramus"
            },
            {
                "variationType": "adjective",
                "variationWord": "thinkable",
                "language style": "colloquial",
                "meaning": "Capable of being thought",
                "example": "That idea is thinkable.",
                "wordReferenceInExample": "thinkable",
                "synonym": "conceivable",
                "antonym": "unthinkable"
            }
        ]
    },
    {
        "root word": "mix",
        "variations": [
            {
                "variationType": "verb",
                "variationWord": "mix",
                "language style": "formal",
                "meaning": "To combine or put together to form one substance or mass",
                "example": "Mix the ingredients thoroughly.",
                "wordReferenceInExample": "Mix",
                "synonym": "blend",
                "antonym": "separate"
            },
            {
                "variationType": "noun",
                "variationWord": "mixture",
                "language style": "informal",
                "meaning": "A substance made by mixing other substances together",
                "example": "The mixture of flour and water was perfect.",
                "wordReferenceInExample": "mixture",
                "synonym": "blend",
                "antonym": "pure"
            },
            {
                "variationType": "adjective",
                "variationWord": "mixed",
                "language style": "colloquial",
                "meaning": "Consisting of different qualities or elements",
                "example": "Her feelings were mixed.",
                "wordReferenceInExample": "mixed",
                "synonym": "blended",
                "antonym": "uniform"
            }
        ]
    }
]

module.exports = {
    openaiProcess
}
