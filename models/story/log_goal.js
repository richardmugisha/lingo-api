import UserContributionDay, { userWritingGoal } from "./user-contribution.js"

function truncateToUTCDate(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function logWritingProgress({ userId, date = new Date(), words }) {
  const today = truncateToUTCDate(date);

  // Always ensure a goal exists
  let goal = await userWritingGoal.findOne({ userId });

  if (!goal) {
    goal = await userWritingGoal.create({
      userId,
      current: {
        startDate: today,
        days: 1,
        wordsPerDay: 300,
      },
      streak: {
        last: null,
        value: 0,
      },
    });
  }

  const ratio = words / goal.current.wordsPerDay //Math.min(words / goal.wordsPerDay, 1); // cap at 1

  // Update contribution count (fractional)
  await UserContributionDay.findOneAndUpdate(
    { userId, date: today },
    { $inc: { count: ratio } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // === Update streak ===
  const last = goal.streak?.last ? truncateToUTCDate(goal.streak.last) : null;
  let newStreak = 1;

  if (last) {
    const diff = (today - last) / (1000 * 60 * 60 * 24);
    if (diff === 1) newStreak = goal.streak.value + 1;
    else if (diff === 0) newStreak = goal.streak.value;
  }

  goal.streak = {
    last: today,
    value: newStreak
  };

  console.log(goal)

  await goal.save();

  return { contributionDate: today, streak: goal.streak };
}
