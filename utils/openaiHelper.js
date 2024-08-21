
const promptMaker = (words, regularOrTemporaryDeck, continuation, pastChunk) => {
    const regular = regularOrTemporaryDeck === 'regular deck'
    const chunkIntroducer = continuation ? `\n\n This is a continuation from a recently interrupted response from you because of token length. Here is the last part: ${pastChunk}. Continue immediately after this. Don't make the mistake of starting a new array. And make sure you don't mess up the json`: '';
    return regular ? regularPrompt(words+chunkIntroducer) : tempPrompt(words+chunkIntroducer)
    }

module.exports = promptMaker


const regularPrompt = (words) => `1. Use this list to generate me a js array for my flash card app. For EACH variation, construct an variation object with information about the variation.
        Each variation has a meaning, an example, a synonym and antonym.
                            A typical variation will be: 
                                
                                        {
                                            variationType: "verb",
                                            variationWord: "the variation of the root word",
                                            "language style": "formal",
                                            "meaning": "The meaning",
                                            "example": "An example",
                                            "wordReferenceInExample": "copy and paste the reference of the variation word in the example",
                                            "synonym": "A synonym",
                                            "antonym": "An antonym"
                                        }
            2. I cannot stress enough how much important it is that the wordReferenceInExample should be as is inside the example given to you or the example you give. For example articulated inside "She articulated her words perfectly"
            3. Strictly respect the names of the object keys I gave you, and all the values are required per my db schema.
            4. Ensure the output is a valid JavaScript array that can be JSON.parsed without errors. Do not include any additional text or comments.
            5. Input : ${words}`
            
const tempPrompt = (objArr) => `1. Use the list of {word, context} objects I am about to give you, and generate a list of JSON objects containing the information that I will need for my flashcard app. 
                Each word might be a root word, a phrasal verb, an expression,..., and I need a bunch of variants of the root word (compute the most basic root word you can get. e.g: if the given word is a verb, the root word should not be conjugated), the variations will be picked from noun, verb, phrasal verb, adjective, adverb, idiom, proverb. 
                You should give me as many variants of the root word as you can. Each variation has to have a style among formal, informal, colloquial, slang, jargon. 
                Then each variation has a meaning, an example, a synonym and antonym.
                One of the variations should  as example, the context that came with the word at each instance.
                
                            A typical object will be: 
                                {
                                    "root word": put,
                                    variations: [
                                        variationType: "verb",
                                        variationWord: "the variation of the root word",
                                        "language style": "formal",
                                        "meaning": "The meaning",
                                        "example": "An example",
                                        "wordReferenceInExample": "copy and paste the reference of the variation word in the example",
                                        "synonym": "A synonym",
                                        "antonym": "An antonym"
                                    ]
                                }
            2. I cannot stress enough how much important it is that the wordReferenceInExample should be as is inside the example given to you or the example you give. For example articulated inside "She articulated her words perfectly"
            3. Strictly respect the names of the object keys I gave you, and all the values are required per my db schema.
            4. The context in each of the {word, context} inputs given to you should be used in one of the examples for each root word.
            5. Ensure the output is a valid JavaScript array that can be JSON.parsed without errors. Do not include any additional text or comments.
            6. Input objects : ${objArr}`