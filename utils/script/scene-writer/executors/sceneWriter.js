import openaiRequest from "../../../openai-process/openaiRequest.js";
import { scenePrompt, sceneSysMsg } from "../prompts/scenePrompt.js";

const sceneWriter = async (props) => {
    try {
        const prompt = scenePrompt(props.neededAssets, props.script, props.episode.logline, props.act.logline, props.scenes.map(sc => sc.logline), props.scene.logline, props.previousScene, props.scene.words)
        // console.log(prompt, "\n\n")
        const genScene = await openaiRequest("gpt-4o-mini", sceneSysMsg, prompt, false)
        console.log(".......... done scene writing")
        return genScene
    } catch (error) {
        console.log(error.message)
    }
}

export default sceneWriter