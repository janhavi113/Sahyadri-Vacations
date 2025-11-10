// cronJob.js
const cron = require("node-cron");
const fetch = require("node-fetch");
const Bookings = require("./models/Bookings"); // adjust path

// Run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("🔁 Checking pending PhonePe payments...");
  const pendingBookings = await Bookings.find({ status: "Pending" });
 const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const url = process.env.PHONEPE_BASE_URL + '/pg/v1/status';
   

  for (const booking of pendingBookings) {
    try {
      let merchantTransactionId = booking._id;
      const res = await fetch(
        `${url}/${merchantId}/${merchantTransactionId}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY":generateXVerify(merchantId, merchantTransactionId),
            "X-MERCHANT-ID":  merchantId,
          },
        }
      );
      const data = await res.json();

      if (data.success && data.code === "PAYMENT_SUCCESS") {
        await Bookings.findByIdAndUpdate(booking._id, {
          $set: {
            status: "Confirmed",
            transactionId: data.data.transactionId,
            paymentMethod: data.data.paymentInstrument?.type || "PhonePe",
            "otherParticipants.$[].status": "Confirmed",
          },
        });
        console.log(`✅ Confirmed ${booking._id} via polling`);
      }
    } catch (error) {
      console.error("Error checking payment status:", error.message);
    }
  }
});
// Function to create X-VERIFY header
function generateXVerify(merchantId, merchantTransactionId) {
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const hash = crypto.createHash('sha256').update(stringToHash).digest('hex');
    return hash + "###" + saltIndex;
}