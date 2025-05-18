import sceneParser from "../prompts/sceneParser.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (scene, words) => {
    try {
        console.log('---- words: ', words)
        const prompt = sceneParser(scene, words)
        if (!words?.length) console.log(words)
        const jsonScene = await openaiRequest("gpt-4o-mini", "You are a raw to json formatter", prompt)
        return JSON.parse(jsonScene).scene
    } catch (error) {
        console.log(error.message)
    }
}