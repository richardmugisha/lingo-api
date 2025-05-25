
Purpose: a chatbot for vocabulary, and fluency buildup.

flow:
    - get a topic, a set of words to practice, then have LLM help you have an amazing and engaging conversation around that topic using the given words
    - welcomer handles the welcoming of a user, introducing them to the plaform if they are new(decide on parameters for that), or simply have a quick small-talk before handing them over to the next step
    - instructor handles the conversation around the topic, making sure to corner the user to use one of the words while replying. The instructor themself should not use the words (but can mention the topic occasionally)
    - closer handles the closing of the session, once the user has touched all the selected words on that topic.
    - coordinator, handles the orchestration, updating the list of words to use by removing the ones the user has already used. Transitioning the user to the next step
    
Rules:
    - we are using a basic xml looking structure bc the chat text maybe streamed later when we need near-zero latency