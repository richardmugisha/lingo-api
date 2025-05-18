
import assetRetriever from "./executors/retriever.js"

export default async (props) => {
    try {

        const assets = await assetRetriever(props)

        return assets
        
    } catch (error) {
        console.log(error.message)
    }
}

