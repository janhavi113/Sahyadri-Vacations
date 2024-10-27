// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import { Bookings } from '../models/Bookings.js';
import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


router.post("/booking", async (req, res) => {
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
        } = req.body;

		let confirmedBookings = await Bookings.find({bookingDate :new Date(req.body.bookingDate).toLocaleDateString()});
		let bookingIdVar = convertDateToCustomFormat(new Date(req.body.bookingDate).toLocaleDateString()) + confirmedBookings.length;

        let parsedParticipants = [];
        if (typeof otherParticipants === 'string') {
            parsedParticipants = JSON.parse(otherParticipants);
        }
		console.log("create req.body --", req.body);

		const booking = new Bookings({
			bookingId: bookingIdVar,
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
            status: "Confirmed",
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

function convertDateToCustomFormat(dateString) {
    // Split the date string (MM/DD/YYYY) into parts
    const [month, day, year] = dateString.split("/");

    // Get the last two digits of the year
    const yearLastTwoDigits = year.slice(-2);

    // Format the output as YYDDMM
    const customFormattedDate = `${yearLastTwoDigits}${day}${month}`;

    return customFormattedDate;
}

export default router;
