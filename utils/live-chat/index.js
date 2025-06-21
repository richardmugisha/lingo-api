// server/utils/live-chat/index.js
import Onboarding from "./onboarding/index.js"
import Instructor from './lesson/index.js';
import Closer from './closer/index.js';
import Coordinator from './coordinator/index.js';

class Chat {
    static chats = new Map();
    constructor({userID, username, topic, totalWords, agentPair, type}) {
        this.type = type || "focused";
        this.cutOff = 10;
        this.userID = userID;
        this.username = username;
        this.isUserNew = true;
        this.instructor = agentPair.instructor;
        this.supervisor = agentPair.supervisor;
        this.topic = topic;
        this.totalWords = totalWords;
        this.usedWords = new Set();
        this.stage = 'onboarding';
        this.details = new Map([
            ["onboarding", []], 
            ["lesson", []], 
            ["closing", []]
        ])
        this.coordinator = new Coordinator(this);   
        this.add(userID)
    }

    add (userID) {
        const key = `${userID}-${this.topic}`;
        Chat.chats.set(key, this);
    }

    static find(userID, topic) {
        return Chat.chats.get(`${userID}-${topic}`)
    }

    getNextStage() {
        return this.coordinator.determineNextStage();
    }

    relationshipRepr (relationship, recallPast) {
        return `
        User preferences: 
            ${relationship.userPreferences}

        Facts about the user:
            ${relationship.userFacts}

        ${recallPast ? 
            (() => {
                const lastInteraction = relationship.lastInteraction;
                const timeSinceLastInteraction = Date.now() - lastInteraction.time;
                const hoursSinceLastInteraction = Math.floor(timeSinceLastInteraction / (1000 * 60 * 60));
                
                if (hoursSinceLastInteraction >= 24) {
                    return `It's been ${hoursSinceLastInteraction} hours since our last interaction.
                    
        And these are the details of our last interaction:
        ${lastInteraction.details}`;
                } else {
                    return "This is not our first interaction today.";
                }
            })()
            : ""
        }
        `
    }

    assistantRepr (assistant) {
        return `
        name: ${assistant.name},
        age: ${assistant.age},
        sex: ${assistant.sex},
        ethnicity: ${assistant.ethnicity},

        ${assistant.shortDescription},

        ${assistant.longDescription}
        
        `
    }
 
}

export default Chat;