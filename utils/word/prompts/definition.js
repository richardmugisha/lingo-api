const definition = (wordsArray) => `
You are given an array of objects, each containing a word or expression and a contextual example.

Your job is to return a JSON object like this:
{
  "definitions": [
    {
      "word": "example word",
      "type": "noun | verb | adjective | adverb | idiom | expression | proverb",
      "example": "The example from the input",
      "blanked example": "Same example but the word is blanked out with _____",
      "language style": "Pick from: formal, neutral, informal, jargon, slang",
      "meaning": "The contextual meaning of the word in the example",
      "synonym": "A synonym in this context",
      "antonym": "An antonym in this context"
    },
    ...
  ]
}

Make sure:
- Each word gets one full definition object.
- Do not leave any field empty.
- Your output must be **valid JSON** that can be parsed with JSON.parse.
- No extra explanation or comments. Just the JSON.

Input: ${JSON.stringify(wordsArray, null, 2)}
`


const definitionSysMsg = "You are an expert lexicographer creating high-quality definitions for vocabulary learners. Always return clean JSON responses only."



export {
    definition,
    definitionSysMsg
}