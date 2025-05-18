
import guide from "./executors/guide.js"
import saver from "./executors/saver.js"

export default async (props, developedScene) => {
    try {
        const savingGuide = await guide(props)
        await saver(props, developedScene, savingGuide)

    } catch (error) {
        console.log(error.message)
    }
}
