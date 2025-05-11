
import assetRetriever from "../asset-retriever/index.js"
import assetSaver from "../asset-saver/index.js"

import sceneWriter from "./executors/sceneWriter.js"

export default async (previousScene, epIndex, actIndex, sceneIndex) => {
    try {
        
        const assets = await assetRetriever(previousScene, epIndex, actIndex, sceneIndex)

        const scene = await sceneWriter(assets, epIndex, actIndex, sceneIndex)

        console.log(scene)

        console.log("\n")

        await assetSaver(scene, epIndex, actIndex)

        return scene

    } catch (error) {
        console.log(error.message)
    }
}
