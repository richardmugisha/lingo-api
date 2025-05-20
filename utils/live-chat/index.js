
import greeting from "./executors/greeting.js";    
import lesson from "./executors/lesson.js";


export default async (step, chat, words) => {
    try {
        return await step === "onboarding" ? greeting(chat) : lesson(chat, words)
    } catch (error) {
        console.log(error.message)
    }
}