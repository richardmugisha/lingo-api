import mongoose from 'mongoose';

const agentUserSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agent',
    required: [true, 'Agent reference is required']
  },
  lastInteraction: {
    time: {
      type: Date,
      default: Date.now
    },
    details: {
      type: String,
      trim: true
    }
  },
  userPreferences: {
    type: String,
    trim: true
  },
  userFacts: {
    type: String,
    trim: true
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
  timestamps: true // This will automatically manage createdAt and updatedAt
});

// Add compound index for user and agent
agentUserSchema.index({ user: 1, agent: 1 }, { unique: true });

// Add any instance methods if needed
agentUserSchema.methods.toJSON = function() {
  const agentUser = this.toObject();
  delete agentUser.__v; // Remove version key
  return agentUser;
};

const AgentUser = mongoose.model('AgentUser', agentUserSchema);

export default AgentUser;
