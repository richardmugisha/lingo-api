
import mongoose from 'mongoose';
import UserContributionDay from '../../models/story/user-contribution.js';

async function logContribution({ userId, date = new Date() }) {
  // Truncate time to UTC midnight
  const truncatedDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));

  const result = await UserContributionDay.findOneAndUpdate(
    { userId, date: truncatedDate },
    { $inc: { count: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return result;
}


const userId = '668420cef4108d0339eddda6'; // replace with a real user ObjectId

async function runTest() {

//   console.log('--- Add contribution today ---');
//   let todayEntry = await logContribution({ userId });
//   console.log(todayEntry);

//   console.log('--- Add another contribution today ---');
//   todayEntry = await logContribution({ userId });
//   console.log(todayEntry);

  console.log('--- Add contribution yesterday ---');
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 10);
  const yestEntry = await logContribution({ userId, date: yesterday });
  console.log(yestEntry);

  await mongoose.disconnect();
}

export default runTest
