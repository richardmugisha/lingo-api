
import greeting from "./executors/greeting.js";    
import lesson from "./executors/lesson.js";


export default async (step, chat, words, topic) => {
    try {
        return await step === "onboarding" ? greeting(chat) : lesson(chat, words, topic)
    } catch (error) {
        console.log(error.message)
    }
}