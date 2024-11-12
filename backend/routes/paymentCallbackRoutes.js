import { Router } from 'express';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const router = Router();

// This route will handle the callback from PhonePe
router.post('/phonepe/payment-callback', (req, res) => {
  const callbackData = req.body; // PhonePe sends the callback data in the request body

  // For security, recompute the checksum to verify the integrity of the data
  const payloadString = JSON.stringify(callbackData);
  console.log('payloadString--',payloadString);
  const sha256Hash = crypto.createHash('sha256').update(payloadString).digest('hex');
  console.log('sha256Hash--',sha256Hash);
  const saltKey = process.env.PHONEPE_MERCHANT_ID;
  console.log('saltKey--',saltKey);
  const finalHash = sha256Hash + saltKey;
  console.log('finalHash--',finalHash);
  const checksum = crypto.createHash('sha256').update(finalHash).digest('hex');
  console.log('checksum--',checksum);
  const receivedChecksum = req.headers['x-verify'];
  console.log('receivedChecksum--',receivedChecksum);
  if (receivedChecksum !== checksum) {
    console.error('Invalid checksum!');
    return res.status(400).json({ error: 'Invalid checksum' });
  }

  // Extract relevant information from the callback
  const { merchantTransactionId, status, responseCode, responseMessage } = callbackData;

  if (status === 'SUCCESS' && responseCode === '0000') {
    // Payment successful - You can update your database, order status, etc.
    console.log(`Payment Successful for Order ${merchantTransactionId}`);
    return res.status(200).json({ message: 'Payment Successful' });
  } else {
    // Payment failed
    console.log(`Payment Failed for Order ${merchantTransactionId}: ${responseMessage}`);
    return res.status(400).json({ message: 'Payment Failed', error: responseMessage });
  }
});

export default router;
