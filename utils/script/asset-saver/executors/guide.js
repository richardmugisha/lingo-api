import { guide as guidePrompter, guideSysMsg } from "../prompts/saverGuide.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

import { loadStructure, loadAssetLog, extractKeyDetails } from "../../assets/index.js"

export default async (developedScene, epIndex, actIndex) => {
    try {
        const structure = loadStructure()
        const log = loadAssetLog()

        const { episode, act, scenes, scene } = extractKeyDetails(structure, epIndex, actIndex, 0)

        const prompt = guidePrompter(log, structure, episode.logline, act.logline, scenes.map(sc => sc.logline), developedScene)

        console.log(prompt)

        const guide = await openaiRequest("gpt-4o-mini", guideSysMsg, prompt)

        console.log(guide)

        return JSON.parse(guide)
        
    } catch (error) {
        console.log(error.message)
    }
}