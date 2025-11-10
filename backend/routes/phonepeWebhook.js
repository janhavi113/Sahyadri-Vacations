import express from "express";
import Bookings from "../models/Bookings.js";

const router = express.Router();

// 📩 PHONEPE WEBHOOK ENDPOINT
router.post("/phonepe/webhook", async (req, res) => {
  try {
    console.log("📩 Webhook received:", req.body);

    const { merchantTransactionId, code, data } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).send({ message: "Missing transaction ID" });
    }

    // If payment succeeded
    if (code === "PAYMENT_SUCCESS") {
      await Bookings.findOneAndUpdate(
        { _id: merchantTransactionId },
        {
          $set: {
            status: "Confirmed",
            transactionId: data?.transactionId,
            paymentMethod: data?.paymentInstrument?.type || "PhonePe",
            "otherParticipants.$[].status": "Confirmed",
          },
        }
      );
      console.log(`✅ Booking ${merchantTransactionId} marked Confirmed`);
    } else if (code === "PAYMENT_ERROR" || code === "PAYMENT_FAILED") {
      await Bookings.findOneAndUpdate(
        { _id: merchantTransactionId },
        { $set: { status: "Failed" } }
      );
      console.log(`❌ Booking ${merchantTransactionId} marked Failed`);
    }

    res.status(200).send({ message: "Webhook processed" });
  } catch (err) {
    console.error("❗ Webhook error:", err);
    res.status(500).send({ message: "Server error" });
  }
});

export default router;
