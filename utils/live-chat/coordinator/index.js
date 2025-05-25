import Onboarding from "../onboarding/index.js";
import Lesson from "../lesson/index.js"
import Closer from "../closer/index.js";

import shouldTransition from "./executors/shouldTransition.js";

class Coordinator {
    static stages = ["onboarding", "lesson", "closing"]
    constructor(chat) {
        this.chat = chat;
        this.onboarding = new Onboarding(this.chat)
        this.lesson = new Lesson(this.chat)
        this.closer = new Closer(this.chat)
    }

    async reply(message) {
        this.addUserMessage(message)
        if (this[this.chat.stage].wrappingUp) {
            // check if can transition
            console.log('supposed to wrap up')
            const verdict = await shouldTransition(this.chat.details.get(this.chat.stage).slice(-5))
            if (verdict) {
                this.nextStage()
            }
            this[this.chat.stage].wrappingUp = false
            console.log(verdict ? 'hhahahahah ----- transitioning': "not ")
        } else {
            this[this.chat.stage].shouldWrapUp()
            console.log('now: ', this[this.chat.stage].wrappingUp)
        }
        
        const response = await this[this.chat.stage].steps[this[this.chat.stage].stage]()
        this.addAssistantMessage(response)
        return response
    }

    nextStage () {
        const stage = this[this.chat.stage].moveUp()
        if (!stage) {
            this.moveUp()
        }
    }

    moveUp () {
        const indexOfCurrentStage = Coordinator.stages.indexOf(this.chat.stage)
        this.chat.stage = Coordinator.stages[indexOfCurrentStage + 1]
        return this.chat.stage
    }


    addUserMessage (message) {
        if (message) {
            this.chat.details.get(this.chat.stage).push(
                `${this.chat?.username}: ${message}

                `
            )
        }
    }

    addAssistantMessage (message) {
        if (message) {
            this.chat.details.get(this.chat.stage).push(
                `${this[this.chat.stage].assistant}: ${message}

                `
            )
        }
    }

    // determineNextStage() {
    //     if (this.chat.stage === 'welcoming') {
    //         return 'instructing';
    //     }
    //     if (this.chat.stage === 'instructing' && this.chat.usedWords.size === this.chat.totalWords.length) {
    //         return 'closing';
    //     }
    //     return this.chat.stage;
    // }

    // async welcomeUser() {
    //     const response = await this.welcomer.handleMessage()
    // }

    // async teachUser() {
    //     const response = await this.instructor.handleMessage()
    // }

    // async closeChat() {
    //     const response = await this.closer.handleMessage()
    // }

}

export default Coordinator;