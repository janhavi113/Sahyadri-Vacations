import express from 'express';
import crypto from 'crypto';
import base64 from 'base64url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';  // Ensure you install node-fetch package
// Load environment variables
dotenv.config();

const router = express.Router();
// Simple delay function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Endpoint for initiating payment
router.post('/phonepe/payment', async (req, res) => {
    try {
        const {
            amount,
            orderId,
            mobileNumber,
        } = req.body;

        //console.log('amount--', amount);
        // Prepare the payload
        const payload = {
            merchantId: process.env.PHONEPE_MERCHANT_ID,
            merchantTransactionId: orderId,
            merchantUserId: 'MUID' + orderId,
            amount: Number(amount) * 100,
            redirectUrl: process.env.REDIRECT_URL + '?booking-id=' + orderId,
            redirectMode: "REDIRECT",
            callbackUrl: process.env.CALLBACK_URL,
            mobileNumber: mobileNumber,
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };
        //console.log('JSON.stringify(payload)--', payload);
        // Base64 encode the payload
        const base64Payload = base64.encode(JSON.stringify(payload));

        // Calculate X-VERIFY header (SHA256 of base64 payload + "/pg/v1/pay" + salt key)
        const saltKey = process.env.PHONEPE_SALT_KEY;
        const saltIndex = process.env.PHONEPE_SALT_INDEX;
        const url = process.env.PHONEPE_BASE_URL + '/pg/v1/pay';
        //console.log('url--', url);
        const xVerify = calculateXVerify(base64Payload, saltKey, saltIndex);

        // Prepare headers for the API request
        const headers = {
            'Content-Type': 'application/json',
            'X-VERIFY': xVerify
        };

        // Prepare the request body for PhonePe
        const requestPayload = {
            request: base64Payload
        };

        // Try to send the request to PhonePe
        let responseData;
        let retries = 5; // Increase retry limit for tougher cases
        let retryDelay = 10000; // Start with 10 seconds delay between retries

        for (let attempt = 1; attempt <= retries; attempt++) {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestPayload)
            });

            responseData = await response.json();
            //console.log('JSON.stringify(responseData)--', responseData);
            if (responseData.success) {
                break; // Successfully received the response, exit the loop
            } else {
                if (responseData.code === 'TOO_MANY_REQUESTS' && attempt < retries) {
                    //console.log(`Rate limit exceeded, retrying in ${retryDelay / 1000} seconds...`);
                    await delay(retryDelay); // Wait before retrying
                    retryDelay *= 2; // Exponential backoff (increase delay for next retry)
                } else {
                    break; // No need to retry on other errors
                }
            }
        }

        //console.log('responseData', responseData);
        if (responseData.success) {
            res.json({ redirectUrl: responseData.data.instrumentResponse.redirectInfo.url });
        }

    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ success: false, message: 'Something went wrong' });
    }
});

// Function to check transaction status
router.get('/check-status/:merchantTransactionId', async (req, res) => {
    const { merchantTransactionId } = req.params;
    const merchantId = process.env.PHONEPE_MERCHANT_ID;

    const url = `https://api.phonepe.com/apis/hermes/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    const headers = {
        'Content-Type': 'application/json',
        'X-VERIFY': generateXVerify(merchantId, merchantTransactionId),
        'X-MERCHANT-ID': merchantId
    };
    //console.log('Request URL:', url);
    //console.log('Request Headers:', headers);

    try {
        const response = await fetch(url, { method: 'GET', headers });
        // Only parse the body once
        const data = await response.json();
        //console.log('data:', data);
        if (data && data.success) {
            // Handle success
            if (data.code === 'PAYMENT_SUCCESS') {
                return res.json({ status: 'success', details: data });
            } else if (data.code === 'PAYMENT_PENDING') {
                return res.json({ status: 'pending', details: data });
            } else {
                return res.json({ status: 'failed', details: data });
            }
        } else {
            // Handle failure
            return res.status(500).json({ status: 'error', message: 'Unknown error occurred.' });
        }
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
});


// Function to calculate the X-VERIFY header (SHA256 hash)
function calculateXVerify(base64Payload, saltKey, saltIndex) {
    const data = base64Payload + "/pg/v1/pay" + saltKey;
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const hashedPayload = hash.digest('hex');
    return `${hashedPayload}###${saltIndex}`;
}

// Function to create X-VERIFY header
function generateXVerify(merchantId, merchantTransactionId) {
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return hash + "###" + saltIndex;
}
export default router;