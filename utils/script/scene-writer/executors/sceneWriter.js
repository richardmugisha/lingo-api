import openaiRequest from "../../../openai-process/openaiRequest.js";
import { scenePrompt, sceneSysMsg } from "../prompts/scenePrompt.js";
import { loadStructure, extractKeyDetails } from "../../assets/index.js";

const sceneWriter = async (assets, epIndex, actIndex, sceneIndex) => {
    try {
        const structure = loadStructure()
        const { episode, act, scenes, scene, words } = extractKeyDetails(structure, epIndex, actIndex, sceneIndex)
        const prompt = scenePrompt(assets, structure, episode.logline, act.logline, scenes.map(sc => sc.logline), scene.logline, words)
        // console.log(prompt, "\n\n")
        const genScene = await openaiRequest("gpt-4o-mini", sceneSysMsg, prompt, false)
        return genScene
    } catch (error) {
        console.log(error.message)
    }
}

export default sceneWriter