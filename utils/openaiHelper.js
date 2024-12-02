
const promptMaker = (wordObject, regularOrTemporaryDeck) => {
    const regular = regularOrTemporaryDeck === 'regular deck';
    return regularPrompt(wordObject)
    // return regular ? regularPrompt(wordObject) : tempPrompt(wordObject)
    }

const regularPrompt = (wordObject) => `1. You are given an object containing nouns, ..., proverbs and I want you to define them for my flash card app. 
                            A typical output is a json with that follows this structure, with more variations inside of course: 
                                {
                                    definitions: [
                                        {
                                            type: "verb",
                                            word: "the verb",
                                            "language style": "formal",
                                            "meaning": "The meaning",
                                            "example": "The example given to you in the inputs",
                                            "blanked example": "The example with blanks in the place of the key word in the {word, example} input",
                                            "synonym": "A synonym",
                                            "antonym": "An antonym"
                                        }, 
                                        {...}, 
                                        {...}
                                    ]
                                }
            1. Use the examples given to you in the inputs as they help the user recall which movie, article, or book they read the word/expression in.
            2. Strictly respect the names of the object keys I gave you, and all the values are required per my db schema (!!! That means all the fields should be filled).
            3. Ensure the output is a valid json that can be JSON.parsed without errors. Do not include any additional text or comments.
            4. Input : ${wordObject}`


const initial = (words) => `I am giving you a list of comma-separated objects of type = {word: 'a word or expression', example: 'a contextual sentence for the word/expression'}. First, deduce the root/ base forms (usually the verb inside) from them (if no verb, find the form that is the most likely to be the root of the expression). Then use each root word to compute its word family as an object followed by phrasal verbs, idioms, proverbs, etc. Strictly only reply with a json. e.g:
    {
        "word families": [
            { "root word" : speak,
                "nouns": [all nouns including but not limited to "speech", "speaker", "speaking"],
                "verbs": [all verbs including "speak", "misspeak"] empty if none, 
                "adjectives": [all adjs including "speaking", "speechless", "speechful"],
                "adverbs": [all advs including "speakingly", "speechlessly"],
                "phrasal verbs": [all phrasal verbs including "speak up", "speak out", "speak for"],
                "idioms": [all idioms including "actions speak louder than words"],
                "proverbs": [all proverbs]
            }, 
            { "root word" : learn, ..., verbs: ["learn", "unlearn"]}, 
            ...   
        ]
    1. nouns, verbs, ..., adjectives should be arrays containing {word, example} structure.
    2. Use the input {word, example} as it is in one of the family children.
    3. Attention here!!!! One of the examples used must be the input example.
    3. For verbs. Don't add any conjugated forms: past tense or participle, -ing form...  
    4. A phrasal verb is base verb + a preposition like: up, out, for, in, of, against, into, through...
    5. Input: ${words}`

const fullStoryPrompt = (title, summary, words) => `
Your task is to develop a story using this set of words: ${words}. Build a story such that it can be summarized like this : ${summary}. The output should be a valid javascript json with title, and story keys. The story key should be valid js list of objects with sentences and blanks. For each of the input words, provide a sentence containing the word, and the same sentence with the word blanked out. The output should be strictly a valid JavaScript object and it is going straight to my api and parse through JSON.parse automatically. So don't add anything that may hinder that., e.g., { title: ${title || 'generate a suitable title'}, story:[{sentence: 'I am the king of England', blanked: 'I am the ____ of England'}, {...}] }. 
1. sentence and blanked go hand in hand. Don't forget either.
2. Every sentence should contain at least one of the words given to you
3. Make sure you follow the rules of English, and avoid tautology or any other weaknesses in your story.
4. Most importantly, write a story that makes sense, with coherence and no repetition.
`

const chunkStoryPrompt = (title, summary, words, currentStory) => `You are co-writing a story with a user, adding one sentence at a time. Use one or two of these words${currentStory && ", but don't repeat what has already been used in ongoing story"}: ${words} and follow the summary: "${summary}". ${currentStory ? 'Avoid repeating previous sentences or ideas and continue logically from: ' + currentStory: "Provide the starting sentence"}. 
The output should be a valid json object that will not throw an error when passed through JSON.parse in my api. e.g: { title: ${title || 'generate a suitable title'}, aiSentence: { sentence: "your sentence", blanked: the same sentence, but with the word(s) blanked out}}.
Make sure your sentence includes one or two of the words given to you, but not words that have alread been used in the story.
`
 

module.exports = {promptMaker, initial, fullStoryPrompt, chunkStoryPrompt}
