import mongoose from "mongoose";

const userContributionDaySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  date: { type: Date, required: true, index: true }, // truncated to day
  count: { type: Number, default: 1 },
}, {
  timestamps: true,
});

userContributionDaySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model('UserContributionDay', userContributionDaySchema);

const userWritingGoalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    streak: {
        last: Date,
        value: Number,
    },

    current: {
        startDate: { type: Date, required: true },         // when the goal starts
        days: { type: Number, required: true },            // e.g. 30
        wordsPerDay: { type: Number, required: true },     // e.g. 200
    },
    upcoming: {
        startDate: { type: Date },         // when the goal starts
        days: { type: Number },            // e.g. 30
        wordsPerDay: { type: Number },     // e.g. 200
    }
})

userWritingGoalSchema.index({ userId: 1}, { unique: true})

export const userWritingGoal = mongoose.model('UserWritingGoal', userWritingGoalSchema)