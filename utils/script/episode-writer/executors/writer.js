
import openaiRequest from "../../../openai-process/openaiRequest.js"   
import { writer, writerSysMsg } from "../prompts/writer.js"

const episodeWriter = async (props) => {
    try {
        const episodePrompt = writer(props.assets, props.script, props.previousEpisode, props.episode)

        const actsRes = await openaiRequest("gpt-4o-mini", writerSysMsg, episodePrompt)

        const acts = JSON.parse(actsRes).acts

        return acts

        // props.script.episodes[0] = episode

        // props.episode = episode

        // await props.script.save()

    } catch (error) {
        console.log(error.message)
    }
}

export default episodeWriter