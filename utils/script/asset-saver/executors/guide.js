import { guide as guidePrompter, guideSysMsg } from "../prompts/saverGuide.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

export default async (props) => {
    try {

        const prompt = guidePrompter(props.assetLog, props.script, props.episode.logline, props.act.logline, props.scenes.map(sc => sc.logline), props.scene)


        const guide = await openaiRequest("gpt-4o-mini", guideSysMsg, prompt)


        return JSON.parse(guide)
        
    } catch (error) {
        console.log(error.message)
    }
}