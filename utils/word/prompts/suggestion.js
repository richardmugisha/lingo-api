const suggestion = (path, topic, number, excluded) => `
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
const suggestionSysMsg = `
Imagine yourself like a curriculum designer, only this time, you are helping an english learner to learn all the necessary words/expressions they need to excell in life, career, and prosper.
You are helping a user to exhaust a topic and be fluent about it (just vocabulary)
`

export {
    suggestion,
    suggestionSysMsg
}