
import guide from "./executors/guide.js"
import saver from "./executors/saver.js"

export default async (developedScene, epIndex, actIndex) => {
    try {
        const savingGuide = await guide(developedScene, epIndex, actIndex)
        await saver(developedScene, savingGuide)

    } catch (error) {
        console.log(error.message)
    }
}
