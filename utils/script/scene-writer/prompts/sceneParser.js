

const parser = (scene, words) => `
You are given a raw scene and you job is to json structure it for easy querying
You have to mention the line text, the type of line (narration or line (for acted lines)), the actor (if it's not a narration line)
Moreover since these scenes are used for students to practice desired words, here is a list of words to hide, and how to do that
- you add a paraphrased field and you paraphrased the line so that it doesn't contain that word/expression while keeping the same meaning
- and you add a word field that contains the word you just removed
- words: ${words}
Typical json output:
{
    scene: [
        {
            type: narration,
            text: the line text,
            character: the character who says this line (if not narration)
            paraphrased: the paraphrased version if need be,
            word: the word that caused the paraphrasing
        },
        {...}
        ...
    ]
}

The scene: ${scene}
`

export default parser