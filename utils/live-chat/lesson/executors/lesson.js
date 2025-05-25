import { sysMsg, msg } from "../prompts/lesson.js"
import openaiRequest from "../../../openai-process/openaiRequest.js"

import { getRelationship } from "../../coordinator/executors/userAssistantPast.js"

export default async (instructor) => {
    try {
        if (instructor.chat.details.get("lesson").length === 0 ) {
            const { relationship, isUserNew } = await getRelationship(instructor.chat.userID, instructor.assistant._id)
            instructor.userAssistantPast = relationship
        }

        const sysPrompt = sysMsg(instructor)
        const prompt = msg(instructor)

        const response = await openaiRequest("gpt-4o-mini", sysPrompt, prompt)

        return response
        
    } catch (error) {
        console.log(error.message)
    }
}