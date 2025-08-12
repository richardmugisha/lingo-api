import mongoose, { Schema } from 'mongoose';

const StructureSchema = new mongoose.Schema({
    userID: { type: Schema.Types.ObjectId, required: true },
    structure: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    versionKey: false,
    minimize: false // 🔹 keeps empty objects in MongoDB
});



const Structure = mongoose.model('Structure', StructureSchema);
export default Structure;