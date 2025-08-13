import summaryGenerator from './components/summary.js';
import aiMessage from './components/aiMessage.js';

class ChatManager {
    static chats = new Map(); // now shared across all ChatManagers
    static limit = 10;
    static summaryThreshold = 15;

    constructor(userID, chatID, title, summary, messages) {
        this.userID = userID;
        this.chatID = chatID,
        this.title = title;
        this.summary = summary;
        this.messages = ChatManager.sliceMessages(messages);
        ChatManager.addChat(chatID, this);
    }

    static getChat(userID, chatID, title, summary, messages) {
        return ChatManager.chats.get(chatID) || new ChatManager(userID, chatID, title, summary, messages);
    }

    static sliceMessages(messages, limit = ChatManager.limit) {
        return messages?.slice(-limit) || [];
    }

    static addChat(chatID, chatInstance) {
        ChatManager.chats.set(chatID, chatInstance);
    }

    async addChatMessage(role, content) {
        this.messages.push({
            role,
            content,
            timestamp: new Date()
        });

        if (this.messages.length > ChatManager.summaryThreshold) {
            this.summarize();
            this.messages = ChatManager.sliceMessages(this.messages, ChatManager.limit);
        }
    }

    async messageAI(role, content) {
        this.addChatMessage(role, content);
        const [aiResponse, err] = await aiMessage(this.summary, this.messages)
        this.addChatMessage('assistant', aiResponse);
        return {
            title: this.title,
            summary: this.summary,
            messageObj: this.messages[this.messages.length - 1]
        }
    }

    async summarize() {
       const [summary, err] = await summaryGenerator(this.summary, this.messages);
       this.summary = summary || this.summary;
    }
}

export default ChatManager;