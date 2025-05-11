
import structureBuild from "./executors/structure.js"
import sceneWriter from "../scene-writer/index.js"

const orchestractor = async () => {
    try {
        // const structure  = await structureBuild()

        let prev = null;
        let story = ""
        for (let i = 0; i < 3; i++) {
            const scene = await sceneWriter(prev, 0, 0, i)
            prev = scene
            story += scene + "\n\n"
        }

        console.log("\n")

        console.log("story: ============================================")

        console.log(story)

    } catch (error) {
        console.log(error.message)
    }
}


export default orchestractor