import { sysMsg, msg } from "../prompts/welcome.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

import { getRelationship } from "../../coordinator/executors/userAssistantPast.js"

export default async (onboarder) => {
    try {
        if (onboarder.chat.details.get("onboarding").length === 0 ) {
            const { relationship, isUserNew } = await getRelationship(onboarder.chat.userID, onboarder.assistant._id)
            onboarder.userAssistantPast = relationship
            onboarder.chat.isUserNew = isUserNew
        }
        const sysPrompt = sysMsg(onboarder)
        const prompt = msg(onboarder)
        console.log(prompt)
        const response = await openaiRequest("gpt-4o-mini", sysPrompt, prompt)
        return response
    } catch (error) {
        console.log(error.message)
    }
}