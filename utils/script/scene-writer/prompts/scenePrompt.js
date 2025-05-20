
const scenePrompt = (assets, structure, currentEp, currentAct, currentScenes, currentScene, previousScene, currentWord) => `
    You are to write a scene (narrations and character lines) for a story. Depending on where we are in the story, you may initiate or/and adhere to rest of the story
    If initiating, you are to make the (best) judgement call about when to introduce new characters, new places, new objects, new events, new concepts, and whatnot.
    Remember this is one scene out of 100s. So focus on perfecting the dialogue, the character development, the engaging tropes, than just throwing patronizing syntheses.
    
    Feel free to use any conventional scene structure.

    Context:
        - story theme: ${structure.theme}
        - episodes: ${structure.episodes.map(ep => ep.logline)}
        - current episode: ${currentEp}
        - current act log line: ${currentAct}
        - current act scenes: ${currentScenes}
        - scene to develop: ${currentScene}
        - key words (Have to be used at some point in spoken lines of the scene): ${currentWord}
            !! The usage of these words should be logical to show the student how such a word is used in practical contexts.

    past scence:
        ${previousScene || "Couldn't find the past scene. That means this is probably (not absolutely) the very first scene."}

    memory:
    ${JSON.stringify(assets)}        

    ground rules:
        - Golden rule: show, don't tell. 
        - Don't spoon-feed, don't patronize the reader. Don't preach. Let the reader decide on the takeaway or how to feel.
        - a scene should be limited to its scope. Check the current episode, act and scene to decide on what to include in this scene
            e.g: Unless, it's part of your creativity demonstration, scene 1 shouldn't give too much away
        - figures of speech are appreciated. sarcasm, cockiness, and other forms of engaging styles are appreciated
        - There should be way more spoken lines than narration lines. Rule of thumb: use narration only if it can't be a character line.
`

const sceneSysMsg = `
We divided a story creation task into sub tasks and your expertise is in creating individual scenes. You will be given enough context to help you.
The project is for language learners, so your number one priority is to include the key word(s) given to you, while keeping the rest of the scene's language simple.
Your second priority is to keep the scene engaging, and coherent within itself and relative to the entire story.
`

export {
    scenePrompt,
    sceneSysMsg
}