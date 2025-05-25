// server/utils/live-chat/index.js
import Onboarding from "./onboarding/index.js"
import Instructor from './lesson/index.js';
import Closer from './closer/index.js';
import Coordinator from './coordinator/index.js';

class Chat {
    static chats = new Map();
    constructor(userID, username, topic, totalWords, agentPair) {
        this.userID = userID;
        this.username = username;
        this.instructor = agentPair.instructor.name
        this.supervisor = agentPair.supervisor.name
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
        Chat.chats.set(userID, this)
    }

    static findByID(userID) {
        return Chat.chats.get(userID)
    }

    getNextStage() {
        return this.coordinator.determineNextStage();
    }
 
}

export default Chat;