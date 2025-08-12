import Chat from "../../../models/guru/chat.js";
import ChatManager from "../../../utils/guru/index.js";

const getGuruChat = async (req, res) => {
    try {
        const { id } = req.params;
        Chat.findOne({ userID: id })
            .then(chat => {
                if (!chat) {
                    return res.status(404).json({ message: "Guru chat not found" });
                }
                return res.status(200).json(chat);
            })
            .catch(error => res.status(500).json({ message: "Server error", error: error.message }));
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message }); 
    }
}

const createGuruChat = async (req, res) => {
    try {
        const { userID, title, summary } = req.body;
        const newChat = new Chat({
            userID,
            title,
            summary,
            messages: []
        });

        newChat.save()
            .then(savedChat => res.status(201).json(savedChat))
            .catch(error => res.status(500).json({ message: "Error creating chat", error: error.message }));

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}   

const chatWithAI = async (req, res) => {
    try {
        const { userID, title, summary, messages, userMessage, ongoing } = req.body;
        const chatManager = ChatManager.getChat(userID, title, summary, messages);

        const chatRes = await chatManager.messageAI('user', userMessage)
        res.status(200).json(chatRes)
    } catch (error) {
        console.error("Error in chatWithAI:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateGuruChat = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, summary, messages } = req.body;
        Chat.findByIdAndUpdate(id, { title, summary, messages }, { new: true })
            .then(updatedChat => {
                if (!updatedChat) {
                    return res.status(404).json({ message: "Guru chat not found" });
                }
                return res.status(200).json(updatedChat);
            })
            .catch(error => res.status(500).json({ message: "Error updating chat", error: error.message }));    
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }   
}   


export { getGuruChat, createGuruChat, updateGuruChat, chatWithAI };