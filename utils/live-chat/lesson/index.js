import lesson from "./executors/lesson.js";    

class Lesson {
    constructor (chat) {
        this.chat = chat;
        this.assistant = chat.instructor;
        this.assistantRole = "knowledgeable conversationalist";
        this.userRole = "student";
        this.userAssistantPast = null;
        this.stage = 'talk';
        this.transitioning = false;
        this.wrappingUp = false
        this.talk = this.talk.bind(this)
        this.steps = {
            "talk": this.talk
        }
    }

    async talk () {
        const response = await lesson(this)
        return response
    }

    shouldWrapUp () {
        return false
    }


    async handleMessage(message, topic, remainingWords) {
        // Guide conversation around topic
        // Encourage use of specific words
        // Track word usage
        // Return response with used word if any
    }
}

export default Lesson