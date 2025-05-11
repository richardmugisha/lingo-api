

const wordDefinitionPromptConstruct = (wordObject) => 
    `1. You are given an object containing nouns, ..., proverbs and I want you to define them for my flash card app. 
                    A typical output is a json with that follows this structure, with more variations inside of course: 
                        {
                            definitions: [
                                {
                                    type: "verb",
                                    word: the verb,
                                    "example": The example given to you in the inputs,
                                    "blanked example": "Take the example you just created, and replace all references of the word with blanks like _____",
                                    "language style": "The style used in the example: pick from (formal, neutral, informal, jargon, slang)",
                                    "meaning": The meaning strictly in the context of the example,
                                    "synonym": A synonym of the word/expression in the context of the example,
                                    "antonym": An antonym of he word/expression in the context of teh example
                                }, 
                                {...}, 
                                {...}
                            ]
                        }
    1. Use the examples given to you (where applicable) in the inputs as they help the user recall which movie, article, or book they read the word/expression in.
    2. Strictly respect the names of the object keys I gave you, and all the values are required per my db schema (!!! That means all the fields should be filled).
    3. Ensure the output is a valid json that can be JSON.parsed without errors. Do not include any additional text or comments.
    4. Input : ${wordObject}`


const wordFamilyGenerationPromptConstruct = (words) => 
    `I am giving you a list of comma-separated objects of type = {word: 'a word or expression', example: 'a contextual sentence for the word/expression'}. First, deduce the root/ base forms of the word/expression (usually the verb inside word/expression). (if no verb, find the form that is the most likely to be the root of the expression). Then use each root word to compute its word family as an object followed by phrasal verbs, idioms, proverbs, etc. 
    Don't over-stretch and add a word/expression that is not in the family.
    You can correct minor user typos and grammar mistakes in the {word, example} input from the user.
    Strictly only reply with a json. e.g:
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
    5. Input: ${JSON.stringify(words)}`

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

const wordFamilySystemMsg = 
`
You are language teacher for non-natives.
1. You should try to use a simple language (instead of unnecessary sophistication) every time it is applicable
2. Try to use well-know words/expression and don't invent or derive any non-existent expressions.
`
const wordDefinitionSystemMsg = 
`
You are language teacher for non-natives.
1. You should try to use a simple language (instead of unnecessary sophistication) every time it is applicable
2. Try to use well-know words/expression and don't invent or derive any non-existent expressions.
`
const chunkStorySystemMsg = 
`
You are language teacher for non-natives.
1. You should try to use a simple language (instead of unnecessary sophistication) every time it is applicable
2. Try to use well-know words/expression and don't invent or derive any non-existent expressions.
`
const fullStorySystemMsg = 
`
You are language teacher for non-natives.
1. You should try to use a simple language (instead of unnecessary sophistication) every time it is applicable
2. Try to use well-know words/expression and don't invent or derive any non-existent expressions.
`

const blanksPrompt = (paragraphs) => `
Take these paragraphs of an article and return me a list of words for my Language learners to 
practice. There are 3 classes of vocabulary learners (A: beginners, B: intermediate, C: advanced). So, now I want you to
focus on advanced students. That means you only extract words that would be relevant for advanced students.
I want at most 15 selected words. And this is the expected output format.

{ words: [
        {
            word: the exact extracted word/expression (I insist on no mistake or oversight),
            fools: [ a list of 3 random words that can grammatically subtitute the extracted word, but would change the meaning of the sentence entirely]
        },
            
        {
            word: the exact extracted word/expression (I insist on no mistake or oversight),
            fools: [ a list of 3 random words that can grammatically subtitute the extracted word, but would change the meaning of the sentence entirely]
        },
        ...
    ]
}

Rules: 
1. The word you pluck has to be in the paragraph whose index you provide,
2. fools have to be incorrect, but close enough for a probability of the student mistaking one of them for the correct word
3. Output must strictly be a valid json
input: 
${paragraphs}
`

const quizPrompt = (paragraphs, title) => `
Take these paragraphs of an article and return me a quiz as a list. The quiz is for me to evaluate the comprehension of the article by my students.
The quiz will contain a list of objects containing one question and 4 answer options, with only 1 correct answer.
The format of the quiz is as follows:
{
    individual: {
        paragraph_1: {
            question: The question on that paragraph, but follows the theme of the article (the context is only the title and the previous paragraphs, but NOT the coming paragraphs)
            answer: The most accurate answer to the question
            false_answers: [
                false answer 1, false answer 2, false answer 3
            ]
        },
        paragraph_2: ...,
        ...
    },
    summary: {
        question: a question on the article in general to guage the understanding of the whole article
        answer: The most accurate answer to the question
        false_answers: [
                false answer 1, false answer 2, false answer 3
        ]
    }
}

Rules:
1. Make sure all paragraphs have corresponding questions
2. false_answers should be wrong but follow the theme of the article
3. The output must strictly be a valid json
4. Most importantly, with all insistance, a paragraph question should draw context from only the title and previous paragraphs. 
    We don't want the answer to be in the paragraphs, the user hasn't read yet. That would be CATASTROPHIC!!!!!!

Input:
  The title of the article is : ${title}
  The paragraphs are : 
    ${paragraphs.map((paragraph, index) => `paragraph_${index}: ${paragraph}\n`) }
`


const scriptSummarySysMsg = `
You are a brilliant creative writer for educational role-play scenarios.
Your job is to come up with fun titles, story summaries, and interesting characters, without using the target vocabulary words.
Respond strictly in clean JSON.
`
const scriptSummaryPrompt = (words, characters = 3) => `
I am creating an English learning platform based on vocabulary mastering through role-playing.

Your current task is to:
1. Propose a creative and fun **title** for a story.
2. Generate a fairly detailed **summary** that captures the essence of that story.
3. Create a small **cast of characters** (around 3-6 characters), giving each:
   - First Name
   - Last Name
   - Whether they are a **main character** or not (isMain: true/false) and there is only one main character
   - Sex (M/F) it has to be an initial like M or F or my app will crash
   - Ethnicity (e.g., White, Black, Asian, Latina, etc.)
   - Age
   - Personality (in a few words)
   - Motivation (what drives them)
   - Relationships (array of {type, to}, where 'to' is another character's first name)

Rules:
- The story must **not** use or hint at the following vocabulary words in the title or summary: ${words}.
- The cast should include at least 20%-30% diversity in ethnicity.
- Output everything in **pure JSON** format.
- Number of characters = ${characters || 3}

Typical JSON output:
{
    "title": "The Great City Chase",
    "summary": "A group of friends must solve a mystery across the city in one afternoon...",
    "characters": [
        {
            "firstName": "Liam",
            "lastName": "Bennett",
            "isMain": true,
            "sex": "M",
            "ethnicty": "White",
            "age": 22,
            "personality": "Curious and daring",
            "motivation": "Prove he can lead",
            "relationships": [
                { "type": "friend", "to": "Maya" }
            ]
        },
        ...
    ]
}
`


const fullScriptPrompt = (title, summary, words, characters) => `
I am creating an English learning platform where users master vocabulary through role-playing scripts.

Now your task is to:
1. Using this list of words (${words}), create a simple and fun **script** where each **key player** uses exactly one vocabulary word per line.
2. Follow this **title** and **summary** to guide the story:
   - Title: ${title}
   - Summary: ${summary}
3. **Characters**:
${JSON.stringify(characters, null, 2)}
   - Only characters with "isMain: true" should have lines that must contain the vocabulary words.
   - Supporting characters can have dialogue too, but they should not use the vocabulary words.
4. Each script item should clearly state:
   - "type": "line" (spoken line) or "narration" (description/cue)
   - "actor": character first name (or null if narration)
   - "line": actual text spoken or narrated
5. For each main character line containing a vocabulary word:
   - Add a "rephrased" field: **rephrase the line** differently but keeping the meaning (to give learners a second way to say it).
6. Important rules:
   - **One word per line only**.
   - **Title and Summary must NOT contain any of the vocabulary words**.
   - **Words are only for the script body**.
7. Write everything in **pure JSON**.

Example JSON output:
{
    "details": [
        {
            "type": "line",
            "actor": "liam",
            "line": "There's a random chance we can find the clue at the mall!",
            "rephrased": "We might stumble upon a clue at the mall by sheer luck!"
        },
        {
            "type": "narration",
            "actor": null,
            "line": "Liam dashes toward the bustling mall entrance."
        }
    ]
}
`

const fullScriptSystemMsg = `
You are a master scriptwriter specializing in educational role-plays for English learners.
You generate fun and simple scripts based on given titles, summaries, and character lists.
Your output must strictly follow the requested JSON format, ensuring clarity, vocabulary practice, and fun.
`

const wordGenerationPrompt = (path, topic, number, excluded) => `
Generate a roadmap of topics to help english learners learn the most important words and expressions (idioms, proverbs, ..., verbs, adverbs) in different areas of life, industries, academic fields,...
Basically, we are trying to engineer the most fluent, eloquent English-as-Second-Language James Bond, who has all necessary words and expressions at their finger tips.
To clarify, you are to generate a list of the ${number || 10} most important words/expressions around a given topic

typical json output:

{
    suggestions: [
        {
            word: one of the must-know words/expressions on this topic
            context: a real-life sentence that uses this word/expression. This shouldn't be a definition or a low-effort generated sentence.
        },
        {...}, ...
    ]
}

1. The output basically a json object. And you don't have to use the topics in this example
2. The user is interested in this topic: ${topic}
${ path && "3. This is the precise description of the topic whose word family you are generating: " + path
}
${ excluded?.length && "4. These are the words to exclude, because the user already has them saved. So think of any other words/expressions. list: " + excluded}
`
const wordSystmMsg = `
Imagine yourself like a curriculum designer, only this time, you are helping an english learner to learn all the necessary words/expressions they need to excell in life, career, and prosper.
You are helping a user to exhaust a topic and be fluent about it (just vocabulary)
`


export {
    wordDefinitionPromptConstruct, wordFamilyGenerationPromptConstruct, 
    fullStoryPrompt, chunkStoryPrompt,
    wordFamilySystemMsg, wordDefinitionSystemMsg,
    chunkStorySystemMsg, fullStorySystemMsg,
    blanksPrompt, quizPrompt,
    scriptSummaryPrompt, scriptSummarySysMsg,
    fullScriptPrompt, fullScriptSystemMsg,
    wordGenerationPrompt, wordSystmMsg,
}
