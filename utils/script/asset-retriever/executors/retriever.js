
import { loadAssets } from "../../assets/index.js"

import { retriever, retrieverSysMsg } from "../prompts/retrieverPrompt.js"

import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (props) => {
    try {
        // const structure = loadStructure()

        // const { episode, act, scenes, scene } = extractKeyDetails(structure, epIndex, actIndex, sceneIndex)

        const prompt = retriever(props.assetLog, props.script, props.episode.logline, props.act.logline, props.scenes.map(sc => sc.logline), props.previousScene, props.scene.logline)

        // console.log(prompt)

        const retrieverGuide = await openaiRequest("gpt-4o-mini", retrieverSysMsg, prompt)


        // console.log(retrieverGuide)

        const assets = loadAssets(JSON.parse(retrieverGuide), props.assets)


        const valid = Object.entries(assets || {}).filter(([k, v]) => v)


        return Object.fromEntries(valid)


    } catch (error) {
        console.log(error.message)
    }
}