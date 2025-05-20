
import openaiRequest from "../../openai-process/openaiRequest.js"
import {
    msg, sysMsg
} from "../prompts/lesson.js"

const chats = []


export default async(userChat, words, topic) => {
    try {
        if (userChat) chats.push("Richard: " + userChat)
        const sysPrompt = sysMsg(
           topic, "Richard", "Bethany", chats
        )
        const prompt = msg(words, topic, chats)
        console.log(prompt)
        const res = await openaiRequest("gpt-4o-mini", sysPrompt, prompt)

        const chat = extractTagContent(res, 'chat')
        const word = extractTagContent(res, 'word')

        chats.push("Bethany: " + chat)

        console.log(chat)

        return {chat, word }
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
  