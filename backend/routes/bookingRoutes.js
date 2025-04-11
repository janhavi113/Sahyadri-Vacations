// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import fs from 'fs';
import { Bookings } from '../models/Bookings.js';
import { ScheduleBatches } from '../models/ScheduleBatches.js';
import { fileURLToPath } from 'url';
import { generateInvoicePdf } from '../utils/pdf-generator.js';
import { sendInvoiceEmail } from '../utils/email-sender.js';
import { log } from 'console';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to check if the date is today
function isBookingDateToday(dateString) {
    const [month, day, year] = dateString.split("/").map(Number);
    const booking = new Date(year, month - 1, day);

    const today = new Date();
    return (
        booking.getDate() === today.getDate() &&
        booking.getMonth() === today.getMonth() &&
        booking.getFullYear() === today.getFullYear()
    );
}

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
            eventStartDate,
            eventEndDate,
        } = req.body;
        let bookingIdVar = await generateBookingId(req.body.bookingDate);

      
        console.log('req.body---', req.body);

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
            eventStartDate: eventStartDate,
            eventEndDate: eventEndDate,
        });
      
        await booking.save();
        Bookings.deleteMany({ bookingId: { $exists: false } })
        .then((result) => {
          console.log("Deleted documents:", result.deletedCount);
        })
        .catch((err) => {
          console.error("Error deleting documents:", err);
        });
      
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
// DELETE endpoint to delete booking records with name "Janhavi Jadhav"
router.delete('/delete-bookings', async (req, res) => {
    try {
        // Deleting records with the name "Janhavi Jadhav"
        const result = await Bookings.deleteMany({ mobileNumber: 9922978022 });
        console.log('result---', result);
        res.status(200).json({
            message: `${result.deletedCount} booking(s) deleted successfully.`,
        });
    } catch (err) {
        console.error('Error deleting booking records:', err);
        res.status(500).json({
            message: 'An error occurred while deleting booking records.',
            error: err.message,
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
            addedDiscount,
            remainingAmount,
            doubleSharing,
            tripalSharing,
            thirdAcUpgrate,
            specialNote,
            convenienceFee
        } = req.body;


        let parsedParticipants = [];
        if (typeof otherParticipants === 'string') {
            parsedParticipants = JSON.parse(otherParticipants);
        }
        ////console.log("create req.body --", req.body);

        const updatedBooking = await Bookings.findOneAndUpdate(
            { _id: bookingId }, // Filter
            {
                $set: {
                    numberOfPeoples: numberOfPeoples,
                    amountPaid: amountPaid,
                    pickupLocation: pickupLocation,
                    otherParticipants: parsedParticipants,
                    scheduleEventId: scheduleEventId,
                    status: "Pending",
                    addedDiscount: addedDiscount,
                    remainingAmount: remainingAmount,
                    doubleSharing: doubleSharing,
                    tripalSharing: tripalSharing,
                    thirdAcUpgrate: thirdAcUpgrate,
                    specialNote: specialNote,
                    convenienceFee: convenienceFee

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
    console.log('payment req.body---', req.body);
    try {
        const {
            paymentMethod,
            transactionId,
            bookingId
        } = req.body;

        const updatedBooking = await Bookings.findOneAndUpdate(
            { _id: bookingId }, // Filter
            {
                $set: {
                    transactionId: transactionId,
                    paymentMethod: paymentMethod,
                    status: "Confirmed",
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
        console.log('payment req.body---', updatedBooking);
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

// Function to generate a unique Booking ID
const generateBookingId = async (bookingDate) => {
    const formattedDate = convertDateToCustomFormat(new Date(bookingDate).toLocaleDateString());

    // Find and update the latest booking with an atomic increment
    const updatedBooking = await Bookings.findOneAndUpdate(
        { bookingDate: new Date(bookingDate).toLocaleDateString() }, // Match today's date
        { $inc: { bookingCounter: 1 } }, // Atomic increment to avoid duplicates
        { new: true, upsert: true } // Create a new record if none exists
    );

    if (updatedBooking) {
        return formattedDate + String(updatedBooking.bookingCounter).padStart(2, '0'); // Ensure at least 2 digits
    }

    return formattedDate + "01"; // Start with 01 if no previous bookings exist
};

// Function to convert date to custom format (YYDDMM)
function convertDateToCustomFormat(dateString) {
    const [month, day, year] = dateString.split("/");
    return `${parseInt(day) < 10 ? '0' + day : day}${parseInt(month) < 10 ? '0' + month : month}${year}`;
}


router.post("/sendInvoice", async (req, res) => {
    const bookingDetails = req.body;
    console.log('sendInvoice req.body----', req.body);

    if (!bookingDetails.bookingId) {
        return res.status(400).send('Booking ID is required');
    }

    let pdfPath;
    if (process.env.NODE_ENV === 'production') {
         console.log('in iff');         
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
                    { _id: bookingDetails._id },
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
router.get("/show-all-bookings/:showOptions", async (req, res) => {
    try {
        updateExpiredBookings();
        let query;
        console.log('req.params.showOptions--', req.params.showOptions);
        if (req.params.showOptions == 'all') {
            query = { active: true };
        } else {
            query = { active: true, status: req.params.showOptions};
        }
        let bookings = await Bookings.find(query);
        res.send({
            isSuccess: true,
            bookings: bookings
        });

    } catch (error) {
        console.error(error);
        res.send({
            isSuccess: false,
            error: error
        });
    }
});
async function updateExpiredBookings() {
    try {
        // const result = await Bookings.deleteMany({ mobileNumber: '9922978022' });
        // console.log(`${result.deletedCount} booking(s) deleted successfully.`);
        const currentDate = new Date();
        console.log('currentDate--', currentDate);
        
        // Subtract one day from the current date
        const deactivateDate = new Date(currentDate);
        deactivateDate.setDate(currentDate.getDate() - 1); // Subtract 1 day
        console.log('deactivateDate--', deactivateDate);

        const result = await Bookings.updateMany(
            { eventEndDate: { $lt: deactivateDate }, active: true },
            { $set: { active: false } }
        );
        console.log('result---', result);
    } catch (error) {
        console.error("Error updating records:", error);
    }
}

export default router;
