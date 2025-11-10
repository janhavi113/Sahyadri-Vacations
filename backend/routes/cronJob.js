// cronJob.js
import cron from "node-cron";
import fetch from "node-fetch";
import crypto from "crypto"; // ✅ you missed this import
import { Bookings } from "../models/Bookings.js";
import { sendInvoiceForBooking } from "../utils/sendInvoiceHelper.js";

// ⏰ Run every 30 minutes
cron.schedule("*/30 * * * *", async () => {
  console.log("🔁 Checking pending PhonePe payments...");

  try {
    const pendingBookings = await Bookings.find({ status: "Pending" });
    if (pendingBookings.length === 0) {
      console.log("No pending bookings found.");
      return;
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const baseUrl = process.env.PHONEPE_BASE_URL;

    for (const booking of pendingBookings) {
      try {
        const merchantTransactionId = booking._id.toString();
        const url = `${baseUrl}/pg/v1/status/${merchantId}/${merchantTransactionId}`;

        // 🔐 Generate X-VERIFY header
        const xVerify = generateXVerify(merchantId, merchantTransactionId);

        const res = await fetch(url, {
          method: "GET",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            "X-VERIFY": xVerify,
            "X-MERCHANT-ID": merchantId,
          },
        });

        const data = await res.json();

        if (data.success && data.code === "PAYMENT_SUCCESS") {
          console.log(`✅ Payment confirmed for ${booking._id}`);

          // ✅ Update booking in DB and return updated record
          const confirmedBooking = await Bookings.findByIdAndUpdate(
            booking._id,
            {
              $set: {
                status: "Confirmed",
                transactionId: data.data.transactionId,
                paymentMethod:
                  data.data.paymentInstrument?.type || "PhonePe",
                "otherParticipants.$[].status": "Confirmed",
              },
            },
            { new: true } // return updated document
          );

          // 🧾 Send invoice automatically (non-blocking)
          sendInvoiceForBooking(confirmedBooking)
            .then(() =>
              console.log(`📧 Invoice sent for booking ${booking._id}`)
            )
            .catch((err) =>
              console.error(`❌ Failed to send invoice:`, err.message)
            );
        } else {
           await Bookings.findByIdAndUpdate(
            booking._id,
            {
              $set: {
                status: "Cancelled",
                specialNote: `Status: ${data.code}`,
              },
            },
            { new: true }
          );

          console.log(
            `⚠️ Payment still pending for ${booking._id} | Status: ${data.code}`
          );
        }
      } catch (error) {
        console.error("Error checking payment status:", error.message);
      }
    }
  } catch (err) {
    console.error("Global cron error:", err.message);
  }
});

// 🔒 Function to create X-VERIFY header
function generateXVerify(merchantId, merchantTransactionId) {
  const saltKey = process.env.PHONEPE_SALT_KEY;
  const saltIndex = process.env.PHONEPE_SALT_INDEX;

  const stringToHash = `/pg/v1/status/${merchantId}/${merchantTransactionId}${saltKey}`;
  const hash = crypto.createHash("sha256").update(stringToHash).digest("hex");

  return `${hash}###${saltIndex}`;
}
