
import openaiRequest from "../../openai-process/openaiRequest.js"
import {
    msg, sysMsg
} from "../prompts/greeting.js"

const chats = []


export default async(userChat) => {
    try {
        if (userChat) chats.push("Richard: " + userChat)
        const sysPrompt = sysMsg("Elene", "Richard", true, true, "ongoing chat", chats, 
            null
        )
        const res = await openaiRequest("gpt-4o-mini", sysPrompt, msg)

        const chat = extractTagContent(res, 'chat')
        const ready = extractTagContent(res, 'ready')

        chats.push("Elene: " + chat)

        console.log(chat, ready)

        return {chat, ready}
    } catch (error) {
        console.log(error.message)
    }
}

function extractTagContent(xml, tag) {
    const startTag = `<${tag}>`;
    const endTag = `</${tag}>`;
  
    const start = xml.indexOf(startTag);
    const end = xml.indexOf(endTag);
  
    if (start === -1 || end === -1) return null;
  
    return xml.substring(start + startTag.length, end);
}
  