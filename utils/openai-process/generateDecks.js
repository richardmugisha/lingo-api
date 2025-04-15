
import openaiRequest from "./openaiRequest.js";
import {
    deckGenerationPrompt, deckSystmMsg
} from "../openaiHelper.js"

const generate = async (fields) => {
    try {
        const prompt = deckGenerationPrompt(fields)
        const decks = await openaiRequest("gpt-4o", deckSystmMsg, prompt)
        // console.log(decks)
        return JSON.parse(decks)
    } catch (error) {
        console.log(error)
    }
}

export default generate