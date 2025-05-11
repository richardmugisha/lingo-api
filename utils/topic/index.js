const topic = (path, topic, number, excluded) => `
Generate a list of topics to help english learners learn the most important words and expressions (idioms, proverbs, ..., verbs, adverbs) in different areas of life, industries, academic fields,...
Basically, we are trying to engineer the most fluent, eloquent English-as-Second-Language James Bond, who has all necessary words and expressions at their finger tips.
To clarify, you are generating a list of topics.

typical json output:

{
    suggestions: ["engineering", "transport", "tourism", ...]
}

1. The output basically a json object. And you don't have to use the topics in this example
2. ${
    topic ? "You are suggesting a list of " + (number || 5) + " essential topics within this topic: " + topic :
    "You are suggesting " + (number || 5) + " most essential topics that encompass all the topics in the universe"
}
3. Just to be precise, ${ path ? "this the genealogy or context within which the topics you are suggesting should fit: " + path : "You are generating the most fundamental topics from which all topics of the universe are branch"
}
${
    excluded?.length && "4. This is a list of already used topics by the user. Skip them and any topic even remotely related to them. \
    e.g: Don't give me negotiation, if communication is in the list of topics to exclude. Here is the list of those to be excluded: " + excluded
}
`
const topicSysMsg = `
Imagine yourself like a curriculum designer, only this time, you are planning a roadmap for english learner to learn all the necessary words/expressions they need to excell in life, career, and prosper.
Think of this as a way to help someone exhaust a topic and be fluent about it (just vocabulary)
`

export {
    topic,
    topicSysMsg
}