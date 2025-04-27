
import openaiRequest from './openaiRequest.js'

import { fullScriptPrompt,
        fullScriptSystemMsg,
        scriptSummaryPrompt, scriptSummarySysMsg
} from '../openaiHelper.js'

const fullScriptGen = async (title, summary, words, players) => {
    try {
        let summaryObject;
        for (let attempt = 0; attempt < 2; attempt++) {
            summaryObject = await summaryScript(words)
            if (!(summaryObject.characters && summaryObject.title && summaryObject.summary) && attempt == 1) throw new Error("The summary of the script is not valid")
        }

        const {title, summary, characters} = summaryObject

        const prompt = fullScriptPrompt(title, summary, words, characters)
        // console.log(fullScriptSystemMsg, "full")
        // console.log(prompt)

        let detailedScript;

        for (let attempt = 0; attempt < 2; attempt++) {
            const res = await openaiRequest("gpt-4o", fullScriptSystemMsg, prompt)
    
            detailedScript = JSON.parse(res)
    
            if (!(detailedScript.details) && attempt == 1) throw new Error("The details of the script are not valid")
        }

        const finalScript =  {...summaryObject, details: detailedScript.details }

        console.log(finalScript)

        return finalScript
       
    } catch (error) {
        throw error
    }
}



export default fullScriptGen

const summaryScript = async (words) => {
    try {
        const prompt = scriptSummaryPrompt(words)
        for (let attempt = 0; attempt < 2; attempt++) {

            const summaryObject = await openaiRequest("gpt-4o", scriptSummarySysMsg, prompt)
    
            console.log(summaryObject)
    
            return JSON.parse(summaryObject)
        }

    } catch (error) {
        throw error
    }
}