class ChatManager {
    static chats = new Map(); // now shared across all ChatManagers
    static limit = 10;
    static summaryThreshold = 30;

    constructor(userID, title, summary, messages) {
        this.userID = userID;
        this.title = title || "New ChatManager";
        this.summary = summary || "";
        this.messages = ChatManager.sliceMessages(messages);
        ChatManager.addChat(userID, this);
    }

    static getChat(userID, title, summary, messages) {
        return ChatManager.chats.get(userID) || new ChatManager(userID);
    }

    static sliceMessages(messages, limit = ChatManager.limit) {
        return messages?.slice(-limit) || [];
    }

    static addChat(userID, chatInstance) {
        ChatManager.chats.set(userID, chatInstance);
    }

    async addChatMessage(role, content) {
        this.messages.push({
            role,
            content,
            timestamp: new Date()
        });

        if (this.messages.length > ChatManager.summaryThreshold) {
            this.summary = await this.summarize();
            this.messages = ChatManager.sliceMessages(this.messages, ChatManager.limit);
        }
    }

    async messageAI(role, content) {
        await this.addChatMessage(role, content);
        const aiResponse = `AI Response to: ${content}`;
        await this.addChatMessage('assistant', aiResponse);
        return this.messages[this.messages.length - 1];
    }

    async summarize() {
        return `Summary after ${this.messages.length} messages:\n`;
    }
}

export default ChatManager;