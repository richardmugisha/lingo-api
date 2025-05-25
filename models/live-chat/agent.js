import mongoose from 'mongoose'

const agentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot be more than 120']
  },
  sex: {
    type: String,
    required: [true, 'Sex is required'],
    enum: {
      values: ['F', 'M'],
      message: 'Sex must be either F or M'
    }
  },
  role: {
    type: String,
    required: [true, "Must provide the role"],
    enum: {
        values: ['supervisor', 'instructor'],
        message: 'Role must be either supervisor or instructor'
    }
  },
  ethnicity: {
    type: String,
    required: [true, 'Ethnicity is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [100, 'Short description cannot be more than 100 characters']
  },
  longDescription: {
    type: String,
    required: [true, 'Long description is required'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
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

// Add any indexes if needed
agentSchema.index({ name: 1 });

// Add any instance methods if needed
agentSchema.methods.toJSON = function() {
  const agent = this.toObject();
  delete agent.__v; // Remove version key
  return agent;
};

const Agent = mongoose.model('Agent', agentSchema);

export default Agent

