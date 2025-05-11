
import assetRetriever from "./executors/retriever.js"

export default async (previousScene, epIndex, actIndex, sceneIndex) => {
    try {

        const assets = await assetRetriever(previousScene, epIndex, actIndex, sceneIndex)

        return assets
        
    } catch (error) {
        console.log(error.message)
    }
}

