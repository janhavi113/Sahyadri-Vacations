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
        var currUrl = "";
        if (req.files) {
            let sampleFile = req.files.images;
            let uploadPath = path.join(__dirname, '../../public/Images', sampleFile.name);
            currUrl = '/public/Images/' + sampleFile.name;
            sampleFile.mv(uploadPath, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        }
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
        } = req.body;

        let parsedParticipants = [];
        if (typeof otherParticipants === 'string') {
            parsedParticipants = JSON.parse(otherParticipants);
        }

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
            images: currUrl,
            status: "Pending",
            eventPrice: eventPrice,
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
router.post('/confirm-booking/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the booking in DirectBookings
      const directBooking = await DirectBookings.findById(id);

      let bookingIdVar ;
       let confirmedBookings = await Bookings.findOne().sort({ _id: -1 });//.find({ bookingDate: new Date(req.body.bookingDate).toLocaleDateString() });
        if(isBookingDateToday(confirmedBookings.bookingDate)){
            bookingIdVar = Number(confirmedBookings.bookingDate) + 1;
        }else{
            bookingIdVar = convertDateToCustomFormat(new Date(req.body.bookingDate).toLocaleDateString()) + 1;
        }

      if (!directBooking) {
        return res.status(404).json({ message: "Booking not found." });
      }
     
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
        otherParticipants:directBooking.otherParticipants,
        status:'Confirmed',
        batch:directBooking.batch,
      });
  
      await newBooking.save();
  
      // Delete the booking from DirectBookings
       await DirectBookings.findByIdAndDelete(id);
  
      res.status(200).json({ message: "Booking confirmed successfully." ,booking : newBooking});
    } catch (error) {
      console.error("Error confirming the booking:", error);
      res.status(500).json({ message: "Failed to confirm booking." });
    }
  });
  
export default router;
