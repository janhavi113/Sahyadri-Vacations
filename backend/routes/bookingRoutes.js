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
        ////console.log("create req.body --", req.body);

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

        ////console.log("create req.body --", req.body);

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
        //  console.log("create req.body --", req.body);

        const {
            amountPaid,
            numberOfPeoples,
            pickupLocation,
            bookingDate,
            otherParticipants,
            bookingId,
            scheduleEventId,
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
                    bookingDate: bookingDate,
                    otherParticipants: parsedParticipants,
                    status: "Confirmed",
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
        // console.log("Updated booking:", updatedBooking);
        try {
            const ScheduleBatchesRecords = await ScheduleBatches.findOne({ eventId: scheduleEventId });
            let count = 0;
            if (ScheduleBatchesRecords) {
                //console.log('User found:', ScheduleBatchesRecords.alreadyBoockedCount);
                if (ScheduleBatchesRecords.alreadyBoockedCount) {
                    count = Number(ScheduleBatchesRecords.alreadyBoockedCount);
                    count = count + Number(numberOfPeoples);
                } else {
                    count = Number(numberOfPeoples);
                }
                const ScheduleBatchesCountUpdate = await ScheduleBatches.findOneAndUpdate(
                    { eventId: scheduleEventId }, // Filter
                    {
                        $set: {
                            alreadyBoockedCount: count,
                        }
                    },
                    { new: true } // Return the updated document
                )
                console.log('ScheduleBatchesCountUpdate', ScheduleBatchesCountUpdate);
            } else {
                console.log('User not found');
            }
        } catch (error) {
            console.error('Error fetching user:', error);
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

    if (!bookingDetails.bookingId) {
        return res.status(400).send('Booking ID is required');
    }

    const pdfPath = path.resolve(`./invoices/${bookingDetails.bookingId}.pdf`);
    //console.log("Attempting to save PDF at:", pdfPath);

    try {
        await generateInvoicePdf(bookingDetails, pdfPath);
    } catch (err) {
        console.error("Error generating PDF:", err);
        return res.status(500).send("Error generating PDF");
    }

    // Retry loop to check for the existence of the PDF
    const maxRetries = 15;
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
        await sendInvoiceEmail(bookingDetails.email, pdfPath);
        res.status(200).send('Booking successful and invoice sent!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Error processing booking');
    }
});

export default router;
