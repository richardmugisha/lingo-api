
import mongoose, { mongo, Schema } from 'mongoose';

const chatSchema = new Schema({
    userID: mongoose.Schema.Types.ObjectId,
    title: String,
    summary: String,
    messages: [{
        role: String,
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    versionKey: false
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;