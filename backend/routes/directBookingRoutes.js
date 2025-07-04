// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import { DirectBookings } from '../models/DirectBooking.js';
import { Bookings } from '../models/Bookings.js';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import fs from 'fs';
import {
    ScheduleBatches
} from '../models/ScheduleBatches.js';
import { log } from 'console';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.get("/show-all-direct-bookings", async (req, res) => {
    try {
        let bookings = await DirectBookings.find({});
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

router.post('/direct-booking', async (req, res) => {
    try {
        console.log("create req.body --", req.body);

        const {
            fullName,
            email,
            mobileNumber,
            batch,
            eventId,
            eventName,
            amountPaid,
            numberOfPeoples,
            pickupLocation,
            bookingDate,
            otherParticipants,
            eventPrice,
            addedDiscount,
            paymentMethod,
            bookingMode,
            transactionId,
            packageGiven,
            remainingAmount,
            eventStartDate,
            eventEndDate,
        } = req.body;

        let parsedParticipants = [];
        if (typeof otherParticipants === 'string') {
            parsedParticipants = JSON.parse(otherParticipants);
        }
        console.log('parsedParticipants---', parsedParticipants);
        const booking = new DirectBookings({
            name: fullName,
            email: email,
            mobileNumber: mobileNumber,
            batch: batch,
            eventId: eventId,
            eventName: eventName,
            numberOfPeoples: numberOfPeoples,
            amountPaid: amountPaid,
            pickupLocation: pickupLocation,
            bookingDate: new Date(bookingDate).toLocaleDateString(),
            otherParticipants: parsedParticipants,
            status: "Pending",
            eventPrice: eventPrice,
            addedDiscount: addedDiscount,
            paymentMethod: paymentMethod,
            bookingMode: bookingMode,
            transactionId: transactionId,
            packageGiven: packageGiven,
            remainingAmount: remainingAmount,
            eventStartDate: eventStartDate,
            eventEndDate: eventEndDate,
        });

        await booking.save();
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



router.post('/confirm-booking/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the booking in DirectBookings
        const directBooking = await DirectBookings.findById(id);
       // console.log('directBooking--', directBooking);
        let confirmedBookings = await Bookings.findOne({ bookingDate: directBooking.bookingDate }).sort({ _id: -1 });//.find({ bookingDate: new Date(req.body.bookingDate).toLocaleDateString() });
       // console.log('confirmedBookings--', confirmedBookings);
        let bookingIdVar = await generateBookingId(confirmedBookings.bookingDate);
       // console.log('bookingIdVar--', bookingIdVar);
        if (!directBooking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        const parsedParticipants = directBooking.otherParticipants.map(participant => ({
            ...participant.toObject?.(), // in case it's a Mongoose subdocument
            status: "Confirmed"
        }));
        // Insert the booking into the Bookings collection
        const newBooking = new Bookings({
            bookingId: bookingIdVar,
            name: directBooking.name,
            email: directBooking.email,
            mobileNumber: directBooking.mobileNumber,
            numberOfPeoples: directBooking.numberOfPeoples,
            amountPaid: directBooking.amountPaid,
            pickupLocation: directBooking.pickupLocation,
            bookingDate: directBooking.bookingDate,
            eventId: directBooking.eventId,
            eventName: directBooking.eventName,
            otherParticipants: parsedParticipants,
            status: 'Confirmed',
            batch: directBooking.batch,
            eventPrice: directBooking.eventPrice,
            addedDiscount: directBooking.addedDiscount,
            paymentMethod: directBooking.paymentMethod,
            bookingMode: directBooking.bookingMode,
            transactionId: directBooking.transactionId,
            packageGiven: directBooking.packageGiven,
            remainingAmount: directBooking.remainingAmount,
            eventStartDate: directBooking.eventStartDate,
            eventEndDate: directBooking.eventEndDate,
        });

        await newBooking.save();

        //Delete the booking from DirectBookings
        await DirectBookings.findByIdAndDelete(id);

        res.status(200).json({ message: "Booking confirmed successfully.", booking: newBooking });
    } catch (error) {
        console.error("Error confirming the booking:", error);
        res.status(500).json({ message: "Failed to confirm booking." });
    }
});

export default router;
