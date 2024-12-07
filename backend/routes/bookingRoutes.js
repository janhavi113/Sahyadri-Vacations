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
    console.log('sendInvoice req.body----', req.body);

    if (!bookingDetails.bookingId) {
        return res.status(400).send('Booking ID is required');
    }

    let pdfPath;
    if (process.env.NODE_ENV === 'production') {
        pdfPath = path.resolve(`./backend/invoices/${bookingDetails.bookingId}.pdf`);
        console.log("Attempting to save PDF at:", pdfPath);
    } else {
        pdfPath = path.resolve(`./invoices/${bookingDetails.bookingId}.pdf`);
        console.log("Attempting to save PDF at:", pdfPath);
    }

    try {
        // Generate the invoice PDF
        await generateInvoicePdf(bookingDetails, pdfPath);

        // Ensure the file exists
        if (!fs.existsSync(pdfPath)) {
            console.error('PDF file was not found:', pdfPath);
            return res.status(500).send('Error generating PDF');
        }

        // Respond quickly to the client
        res.status(200).send('Invoice generation in progress and email will be sent shortly.');

        // Send email asynchronously
        sendInvoiceEmail(bookingDetails.email, bookingDetails, pdfPath)
            .then(async () => {
                // Update the booking record after successful email delivery
                const updatedBooking = await Bookings.findOneAndUpdate(
                    { bookingId: bookingDetails.bookingId },
                    { $set: { invoiceDelivered: true } },
                    { new: true }
                );
                console.log('Invoice email sent and booking updated:', updatedBooking);
            })
            .catch(err => {
                console.error('Error sending invoice email:', err);
            });
    } catch (err) {
        console.error('Error generating PDF or processing invoice:', err);
        return res.status(500).send('Error processing invoice');
    }
});

export default router;
