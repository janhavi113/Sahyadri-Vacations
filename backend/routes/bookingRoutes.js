// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { Bookings } from '../models/Bookings.js';
import { ScheduleBatches } from '../models/ScheduleBatches.js';
import { fileURLToPath } from 'url';
import { generateInvoicePdf } from '../utils/pdf-generator.js';
import { sendInvoiceEmail } from '../utils/email-sender.js';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post("/booking", async (req, res) => {
    try {
        const {
            fullName,
            email,
            mobileNumber,
            batch,
            eventId,
            eventName,
            bookingDate,
            eventPrice,
        } = req.body;

        let confirmedBookings = await Bookings.find({ bookingDate: new Date(req.body.bookingDate).toLocaleDateString() });
        let bookingIdVar = convertDateToCustomFormat(new Date(req.body.bookingDate).toLocaleDateString()) + confirmedBookings.length;

        const booking = new Bookings({
            bookingId: bookingIdVar,
            name: fullName,
            email: email,
            mobileNumber: mobileNumber,
            batch: batch,
            eventId: eventId,
            eventName: eventName,
            bookingDate: new Date(bookingDate).toLocaleDateString(),
            status: "New",
            eventPrice: eventPrice,
        });
        await booking.save();
        //console.log("booking --", booking);
        res.send({
            isSuccess: true,
            booking: booking
        });


    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});

router.put("/confirmed-booking", async (req, res) => {
    try {
          console.log("create req.body --", req.body);

        const {
            amountPaid,
            numberOfPeoples,
            pickupLocation,
            otherParticipants,
            bookingId,
            scheduleEventId,
            eventStartDate,
            eventEndDate,
            addedDiscount
        } = req.body;


        let parsedParticipants = [];
        if (typeof otherParticipants === 'string') {
            parsedParticipants = JSON.parse(otherParticipants);
        }
        ////console.log("create req.body --", req.body);

        const updatedBooking = await Bookings.findOneAndUpdate(
            { bookingId: bookingId }, // Filter
            {
                $set: {
                    numberOfPeoples: numberOfPeoples,
                    amountPaid: amountPaid,
                    pickupLocation: pickupLocation,
                    otherParticipants: parsedParticipants,
                    scheduleEventId: scheduleEventId,
                    eventStartDate: eventStartDate,
                    eventEndDate: eventEndDate,
                    status: "Pending",
                    addedDiscount:addedDiscount,
                }
            },
            { new: true } // Return the updated document
        );

        // Check if booking was found and updated
        // 
        if (!updatedBooking) {
            return res.status(404).send({
                isSuccess: false,
                message: "Booking not found"
            });
        }
        res.send({
            isSuccess: true,
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).send({
            isSuccess: false,
            error: error.message
        });
    }
});

router.put("/payment-confirmed", async (req, res) => {
    console.log('req.body---',req.body);
    try {
        const {
            paymentMethod,
            transactionId,
            bookingId
        } = req.body;

        const updatedBooking = await Bookings.findOneAndUpdate(
            { bookingId: bookingId }, // Filter
            {
                $set: {
                    transactionId:transactionId,
                    paymentMethod:paymentMethod,
                    status: "confirmed",
                }
            },
            { new: true } // Return the updated document
        );

        // Check if booking was found and updated
        if (!updatedBooking) {
            return res.status(404).send({
                isSuccess: false,
                message: "Booking not found"
            });
        }
        res.send({
            isSuccess: true,
            booking: updatedBooking
        });

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).send({
            isSuccess: false,
            error: error.message
        });
    }
});

function convertDateToCustomFormat(dateString) {
    // Split the date string (MM/DD/YYYY) into parts
    const [month, day, year] = dateString.split("/");

    // Get the last two digits of the year
    const yearLastTwoDigits = year.slice(-2);

    // Format the output as YYDDMM
    const customFormattedDate = `${yearLastTwoDigits}${day}${month}`;

    return customFormattedDate;
}

router.post("/sendInvoice", async (req, res) => {
    const bookingDetails = req.body;
    console.log('sendInvoice req.body----',req.body);
    if (!bookingDetails.bookingId) {
        return res.status(400).send('Booking ID is required');
    }

    const pdfPath = path.resolve(`./backend/invoices/${bookingDetails.bookingId}.pdf`);
    //console.log("Attempting to save PDF at:", pdfPath);

    try {
        await generateInvoicePdf(bookingDetails, pdfPath);
    } catch (err) {
        console.error("Error generating PDF:", err);
        return res.status(500).send("Error generating PDF");
    }

    // Retry loop to check for the existence of the PDF
    const maxRetries = 3;
    let fileExists = false;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        fileExists = fs.existsSync(pdfPath);
        if (fileExists) break;
        //console.log(`PDF not found, retrying in 500ms... (Attempt ${attempt} of ${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (!fileExists) {
        console.error('PDF file was not found:', pdfPath);
        return res.status(500).send('Error generating PDF');
    }

    // Send email with PDF attachment
    try {
        await sendInvoiceEmail(bookingDetails.email, bookingDetails,  pdfPath);
        const updatedBooking = await Bookings.findOneAndUpdate(
            { bookingId: bookingDetails.bookingId }, // Find booking by _id
            { $set: { invoiceDelivered: true } }, // Update field
            { new: true } // Return the updated document
        );
        console.log('updatedBooking---',updatedBooking);
        res.status(200).send('Booking successful and invoice sent!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error processing booking');
    }
});

export default router;
