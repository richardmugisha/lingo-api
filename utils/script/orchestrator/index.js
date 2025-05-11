
import structureBuild from "./executors/structure.js"
import sceneWriter from "../scene-writer/index.js"
import { loadStructure } from "../assets/index.js";

const orchestractor = async () => {
    try {
        // const structure  = await structureBuild()

        const structure = loadStructure()

        let prev = null;
        let story = ""
        let episodeIndex = 0
        let actIndex = 0
        let sceneIndex = 0

        while (episodeIndex < 1) {
            const scene = await sceneWriter(prev, episodeIndex, actIndex, sceneIndex)
            prev = scene
            story += scene + "\n\n"
            sceneIndex++
            const episodes = structure.episodes
            const episode = episodes[episodeIndex]
            const acts = episode.acts
            const act = acts[actIndex]
            const scenes = act.scenes
            if (sceneIndex === scenes.length) {
                actIndex++
                sceneIndex = 0
            }
            if (actIndex === acts.length) {
                episodeIndex++
                actIndex=0
            }
            if (episodeIndex === episodes.length) {
                break
            }
        }
    
        console.log("\n")

        console.log("story: ============================================")

        console.log(story)

    } catch (error) {
        console.log(error.message)
    }
}


export default orchestractor