
import assetRetriever from "../asset-retriever/index.js"
import assetSaver from "../asset-saver/index.js"

import sceneWriter from "./executors/sceneWriter.js"
import sceneParser from "./executors/sceneParser.js"

export default async (props) => {
    try {
        
        const rawDevelopedScene = await sceneWriter(props)

        const jsonDevelopedScene = await sceneParser(rawDevelopedScene, props.scene.words)

        return [rawDevelopedScene, jsonDevelopedScene]

    } catch (error) {
        console.log(error.message)
    }
}
