
import { loadStructure, loadAssetLog, extractKeyDetails, loadAssets } from "../../assets/index.js"
import { retriever, retrieverSysMsg } from "../prompts/retrieverPrompt.js"

import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (previousScene, epIndex, actIndex, sceneIndex) => {
    try {
        const structure = loadStructure()

        const { episode, act, scenes, scene } = extractKeyDetails(structure, epIndex, actIndex, sceneIndex)
        
        const assetLog = loadAssetLog()

        const prompt = retriever(assetLog, structure, episode.logline, act.logline, scenes.map(sc => sc.logline), previousScene, scene.logline)

        // console.log(prompt)

        const retrieverGuide = await openaiRequest("gpt-4o-mini", retrieverSysMsg, prompt)

        // console.log(retrieverGuide)

        const assets = loadAssets(JSON.parse(retrieverGuide))

        // console.log(assets)

        const valid = Object.entries(assets || {}).filter(([k, v]) => v)

        console.log('--- valid ', valid)

        return Object.fromEntries(valid)


    } catch (error) {
        console.log(error.message)
    }
}