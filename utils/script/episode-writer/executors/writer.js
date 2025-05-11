
import openaiRequest from "../../../openai-process/openaiRequest.js"   
import { writer, writerSysMsg } from "../prompts/writer.js"

import Script from "../../../../models/script.js"

const episodeWriter = async () => {
    try {
        const script = await Script.findById('682117926ece6d2cee097676')
        // return console.log(script)
        const episodePrompt = writer(script.assets, script, null, script.episodes[0])
        console.log(episodePrompt)
        const episode = await openaiRequest("gpt-4o-mini", writerSysMsg, episodePrompt)
        console.log(episode)

    } catch (error) {
        console.log(error.message)
    }
}

export default episodeWriter