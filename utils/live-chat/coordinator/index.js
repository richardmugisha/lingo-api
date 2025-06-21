import Onboarding from "../onboarding/index.js";
import Lesson from "../lesson/index.js"
import Closer from "../closer/index.js";

import shouldTransition from "./executors/shouldTransition.js";
import updateUserAssistantPast from "./executors/updateUserAssistantPast.js";   
import { createRelationship, updateRelationship } from "./executors/userAssistantPast.js";

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
        if (this.chat.type === "focused") {
            if (this[this.chat.stage].wrappingUp) {
                // check if can transition
                const verdict = await shouldTransition(this.chat.details.get(this.chat.stage).slice(this.chat.cutOff))
                if (verdict) {
                    this.nextStage()
                }
                this[this.chat.stage].wrappingUp = false
            } else {
                this[this.chat.stage].shouldWrapUp()
                console.log(this.chat.stage + ': ', this[this.chat.stage].wrappingUp)
            }
        }
        const response = await this[this.chat.stage].steps[this[this.chat.stage].stage]()
        this.addAssistantMessage(response)
        if (this.chat.details.get(this.chat.stage).length % 5) this.updateRelationship()
        console.log("here too")
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
                `${this[this.chat.stage].assistant.name}: ${message}

                `
            )
        }
    }

   async updateRelationship () {
        const history = this.chat.details.get(this.chat.stage).slice(-this.chat.cutOff)
        const stageObj = this[this.chat.stage]
        const currentRelationship = stageObj.userAssistantPast
        const newData = await updateUserAssistantPast(this.chat, history, this.chat.username, stageObj.assistant.name, currentRelationship)

        let newRelationship = null;
        if (!currentRelationship) {
            newRelationship = await createRelationship(this.chat.userID, stageObj.assistant._id, 
                newData.lastInteraction,
                newData.userFacts,
                newData.userPreferences
            )
        } else {
            newRelationship = await updateRelationship(this.chat.userID, stageObj.assistant._id, 
                newData.lastInteraction || currentRelationship.lastInteraction.details,
                newData.userFacts || currentRelationship.userFacts,
                newData.userPreferences || currentRelationship.userPreferences
            )
        }

        stageObj.userAssistantPast = newRelationship

   }

}

export default Coordinator;