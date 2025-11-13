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
import { sendInvoiceForBooking } from "../utils/sendInvoiceHelper.js";
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
        } else if (Array.isArray(otherParticipants)) {
            parsedParticipants = otherParticipants;
        }


        // Add/update status field for all participants
        parsedParticipants = parsedParticipants.map((p) => ({
            ...p,
            status: p.status || "Pending" // Or "Pending" depending on your logic
        }));
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
            { _id: bookingId },
            {
                $set: {
                    transactionId,
                    paymentMethod,
                    status: "Confirmed",
                    "otherParticipants.$[].status": "Confirmed", // ✅ update all participants' status
                }
            },
            { new: true }
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

  // 🧾 Send invoice automatically (non-blocking)
router.post("/sendInvoice", async (req, res) => {
  try {
    const bookingDetails = req.body;
    console.log("sendInvoice req.body----", req.body);

    if (!bookingDetails.bookingId && !bookingDetails._id) {
      return res.status(400).send("Booking ID is required");
    }

    // Respond quickly to client
    res.status(200).send("Invoice generation and email sending in progress...");

    // Run invoice logic asynchronously
    await sendInvoiceForBooking(bookingDetails);
  } catch (err) {
    console.error("Error in sendInvoice route:", err);
    res.status(500).send("Error processing invoice");
  }
});

router.get("/show-all-bookings/:showOptions", async (req, res) => {
    try {
        updateExpiredBookings();
        let query;
     //   console.log('req.params.showOptions--', req.params.showOptions);
        if (req.params.showOptions == 'all') {
            query = { active: true };
        } else {
            query = { active: true, status: req.params.showOptions };
        }
        let bookings = await Bookings.find(query);
     //    console.log('bookings ',bookings);
        res.send({
            bookings: bookings,
            isSuccess: true
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
        
    } catch (error) {
        console.error("Error updating records:", error);
    }
}
router.get('/event-batches', async (req, res) => {
    try {
        const result = await Bookings.aggregate([
            {
                $match: {
                    eventName: { $ne: null },
                    batch: { $ne: null },
                },
            },
            {
                $group: {
                    _id: '$eventName',
                    batches: { $addToSet: '$batch' },
                },
            },
            {
                $project: {
                    _id: 0,
                    eventName: '$_id',
                    batches: 1,
                },
            },
        ]);

        res.json({ isSuccess: true, data: result });
    } catch (error) {
        console.error('Error fetching event-batch list:', error);
        res.status(500).json({ isSuccess: false, message: 'Internal server error' });
    }
});

router.post("/cancel-person", async (req, res) => {
    const { bookingId, participantId } = req.body;

    try {
        const originalBooking = await Bookings.findById(bookingId);
        if (!originalBooking) {
            return res.status(404).json({ isSuccess: false, message: "Booking not found" });
        }

        if (!participantId) {
            // CASE: MAIN PERSON CANCELS
            const mainPersonCancelled = new Bookings({
                name: originalBooking.name,
                mobileNumber: originalBooking.mobileNumber,
                eventName: originalBooking.eventName,
                eventEndDate: originalBooking.eventEndDate,
                batch: originalBooking.batch,
                pickupLocation: originalBooking.pickupLocation,
                status: "Cancelled",
                bookingDate: new Date(),
                numberOfPeoples: 1,
                amountPaid: 0,
                bookingId: originalBooking.bookingId + "-CANCELLED",
                eventId: originalBooking.eventId,
                scheduleEventId: originalBooking.scheduleEventId,
                specialNote: "Main person cancelled",
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await mainPersonCancelled.save();

            // Create separate bookings for each other participant
            const newConfirmedBookings = await Promise.all(
                (originalBooking.otherParticipants || []).map((participant, index) => {
                    const newBooking = new Bookings({
                        name: participant.name,
                        mobileNumber: participant.mobileNumber,
                        eventName: originalBooking.eventName,
                        batch: originalBooking.batch,
                        pickupLocation: participant.pickupLocation,
                        status: "Confirmed",
                        bookingDate: new Date(),
                        numberOfPeoples: 1,
                        amountPaid: 0,
                        bookingId: originalBooking.bookingId + "-PART-" + index,
                        eventId: originalBooking.eventId,
                        scheduleEventId: originalBooking.scheduleEventId,
                        specialNote: "Re-created from original booking",
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    return newBooking.save();
                })
            );

            // Delete original record
            await Bookings.findByIdAndDelete(bookingId);

            return res.json({
                isSuccess: true,
                message: "Main booking cancelled and new bookings created for participants"
            });
        } else {
            // CASE: PARTICIPANT CANCELS

            // Find the participant
            const participant = originalBooking.otherParticipants.find(p => p._id.toString() === participantId);
            if (!participant) {
                return res.status(404).json({ isSuccess: false, message: "Participant not found" });
            }

            // Remove the participant
            originalBooking.otherParticipants = originalBooking.otherParticipants.filter(
                p => p._id.toString() !== participantId
            );
            await originalBooking.save();

            // Create new booking with cancelled status
            const cancelledParticipant = new Bookings({
                name: participant.name,
                mobileNumber: participant.mobileNumber,
                eventName: originalBooking.eventName,
                batch: originalBooking.batch,
                pickupLocation: participant.pickupLocation,
                status: "Cancelled",
                bookingDate: new Date(),
                numberOfPeoples: 1,
                amountPaid: 0,
                bookingId: originalBooking.bookingId + "-PART-CANCELLED-" + participantId.substring(0, 6),
                eventId: originalBooking.eventId,
                scheduleEventId: originalBooking.scheduleEventId,
                specialNote: "Participant record from cancelled booking",
                createdAt: new Date(),
                updatedAt: new Date()
            });

            await cancelledParticipant.save();

            return res.json({ isSuccess: true, message: "Participant cancelled" });
        }
    } catch (error) {
        console.error("Cancellation error:", error);
        return res.status(500).json({ isSuccess: false, message: error.message });
    }
});
// routes/report.js
router.get("/booking-report", async (req, res) => {
    try {
       const allBookings = await Bookings.find();

        const booked = allBookings.filter(b => b.status == "Confirmed");
        const triedbooked = allBookings.filter(b => b.status == "Pending");
        const notBooked = allBookings.filter(b => b.status === "New");

        res.send({
            isSuccess: true,
            booked,            
            notBooked,
            triedbooked
        });
    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).send({ isSuccess: false, error: error.message });
    }
});

router.put('/update-pickup-status', async (req, res) => {
    const { bookingId, participantIndex, pickupDone } = req.body;

    try {
        if (participantIndex === null) {
            // Update main booking's pickupDone
            await Bookings.updateOne(
                { _id: bookingId },
                { $set: { pickupDone } }
            );
        } else {
            // Update a specific participant's pickupDone
            const updatePath = `otherParticipants.${participantIndex}.pickupDone`;
            await Bookings.updateOne(
                { _id: bookingId },
                { $set: { [updatePath]: pickupDone } }
            );
        }

        res.json({ isSuccess: true, message: "Pickup status updated." });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ isSuccess: false, message: "Update failed." });
    }
});

export default router;
