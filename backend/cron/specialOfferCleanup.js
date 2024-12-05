import cron from 'node-cron';
import SpecialOffer from '../models/SpecialOffer.js'; // Adjust the path to your model file

// Schedule a job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date();
    const result = await SpecialOffer.deleteMany({ date: { $lt: now } });
    console.log(`${result.deletedCount} expired offers deleted.`);
  } catch (error) {
    console.error('Error deleting expired offers:', error);
  }
});

console.log('Cron job for cleaning up expired special offers is scheduled.');
