// utils/sendInvoiceHelper.js
import path from "path";
import fs from "fs";
import { Bookings } from "../models/Bookings.js";
import { generateInvoicePdf } from "./pdf-generator.js";
import { sendInvoiceEmail } from "./email-sender.js";

export const sendInvoiceForBooking = async (bookingDetails) => {
  console.log("📦 sendInvoiceForBooking() called for:", bookingDetails.bookingId);

  if (!bookingDetails.bookingId) {
    throw new Error("Booking ID is required");
  }

  let pdfPath;
  if (process.env.NODE_ENV === "production") {
    pdfPath = path.resolve(`./invoices/${bookingDetails.bookingId}.pdf`);
  } else {
    pdfPath = path.resolve(`./invoices/${bookingDetails.bookingId}.pdf`);
  }

  try {
    // Generate PDF
    await generateInvoicePdf(bookingDetails, pdfPath);

    // Ensure file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error("PDF file not found after generation");
    }

    // Send invoice email
    await sendInvoiceEmail(bookingDetails.email, bookingDetails, pdfPath);

    // Update DB after successful email
    await Bookings.findOneAndUpdate(
      { _id: bookingDetails._id },
      { $set: { invoiceDelivered: true } },
      { new: true }
    );

    console.log(`✅ Invoice sent and marked delivered for ${bookingDetails.bookingId}`);
    return { success: true, message: "Invoice sent successfully" };
  } catch (error) {
    console.error("❌ Error sending invoice:", error);
    return { success: false, message: error.message };
  }
};
