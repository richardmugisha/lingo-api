
const promptMaker = (wordObject, regularOrTemporaryDeck) => {
    const regular = regularOrTemporaryDeck === 'regular deck';
    return regular ? regularPrompt(wordObject) : tempPrompt(wordObject)
    }

const regularPrompt = (wordObject) => `1. You are given an object containing nouns, ..., proverbs and I want you to define them for my flash card app. 
                            A typical output array of objects will be like this, with more variations inside however: 
                                [{
                                    type: "verb",
                                    word: "the verb",
                                    "language style": "formal",
                                    "meaning": "The meaning",
                                    "example": "An example",
                                    "blanked example": "example with blanks in the place of the verb",
                                    "synonym": "A synonym",
                                    "antonym": "An antonym"
                        
                                }, {...}, {...}]
            1. Strictly respect the names of the object keys I gave you, and all the values are required per my db schema (!!! That means all the fields should be filled).
            2. Ensure the output is a valid JavaScript object that can be JSON.parsed without errors. Do not include any additional text or comments.
            3. Input : ${wordObject}`
            
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



const initial = (words) => `I am giving you a list of comma-separated words/expressions, try deducing the root words / base forms (usually the verb inside) from them (if no verb, find the form that is the most likely to be the root of the expression). Then for each root word, compute a its word family, plus phrasal verbs, idioms, proverbs. Strictly only reply with a js array. e.g: [{ "root word" : speak,
      "nouns": [all nouns including but not limited to "speech", "speaker", "speaking"],
      "verbs": [all verbs including "speak", "misspeak"] empty if none, 
      "adjectives": [all adjs including "speaking", "speechless", "speechful"],
      "adverbs": [all advs including "speakingly", "speechlessly"],
      "phrasal verbs": [all phrasal verbs including"speak up", "speak out", "speak for"],
      "idioms": [all idioms including "actions speak louder than words"],
      "proverbs": [all proverbs]
    }, { "root word" : learn, ..., verbs: ["learn", "unlearn"]}, ...   
    1. For verbs. Don't add any conjugated forms: past tense or participle, -ing form...  
    2. A phrasal verb is a normal + a preposition like: up, out, for, in, of, against, into, through...
    3. Input: ${words}`

const fullStoryPrompt = (title, summary, words) => `
Your task is to develop a story using this set of words: ${words}. Build a story such that it can be summarized like this : ${summary}. The output should be a valid javascript object with title, and story keys. The story key should be valid js list of objects with sentences and blanks. For each of the input words, provide a sentence containing the word, and the same sentence with the word blanked out. The output should be strictly a valid JavaScript object and it is going straight to my api and parse through JSON.parse automatically. So don't add anything that may hinder that., e.g., { title: ${title || 'generate a suitable title'}, story:[{sentence: 'I am the king of England', blanked: 'I am the ---- of England'}, {...}] }. 
1. sentence and blanked go hand in hand. Don't forget either.
2. Every sentence should contain at least one of the words given to you
3. Make sure you follow the rules of English, and avoid tautology or any other weaknesses in your story.
4. Most importantly, write a story that makes sense, with coherence and no repetition.
`

const chunkStoryPrompt = (title, summary, words, currentStory) => `You are co-writing a story with a user, adding one sentence at a time. Use one or two of these words${currentStory && ", but don't repeat what has already been used in ongoing story"}: ${words} and follow the summary: "${summary}". ${currentStory ? 'Avoid repeating previous sentences or ideas and continue logically from: ' + currentStory: "Provide the starting sentence"}. 
The output should be a valid js object that will not throw an error when passed through JSON.parse in my api. e.g: { title: ${title || 'generate a suitable title'}, aiSentence: { sentence: "your sentence", blanked: the same sentence, but with the word(s) blanked out}}.
Make sure your sentence includes one or two of the words given to you, but not words that have alread been used in the story.
`
 

module.exports = {promptMaker, initial, fullStoryPrompt, chunkStoryPrompt}
