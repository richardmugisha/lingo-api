import mongoose from 'mongoose';

const agentPairSchema = new mongoose.Schema({
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: [true, 'Supervisor agent is required']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Agent',
        required: [true, 'Instructor agent is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add any indexes if needed
agentPairSchema.index({ supervisor: 1, instructor: 1 }, { unique: true });

const AgentPair = mongoose.model('AgentPair', agentPairSchema);

export default AgentPair; 