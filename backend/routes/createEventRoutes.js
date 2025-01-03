// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import {
	Events
} from '../models/Event.js';
import {
	ScheduleBatches
} from '../models/ScheduleBatches.js';

import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var recordcount;
var images = {};

// Route to handle file uploads
// Route to handle file uploads
router.post('/create-event', async (req, res) => {
	console.log(' req.files---', req.files);
	var imageList = [];
	let sampleFile = req.files.files;
	console.log('sampleFile--', Array.isArray(sampleFile));
	try {
		if (!Array.isArray(sampleFile)) {
			let uploadPath = path.join(__dirname, '../../public/Images', sampleFile.name);
			imageList.push('public/Images/' + sampleFile.name);
			await sampleFile.mv(uploadPath);
		} else {
			// Use Promise.all for multiple file uploads
			await Promise.all(sampleFile.map(async (file) => {
				let uploadPath = path.join(__dirname, '../../public/Images', file.name);
				imageList.push('public/Images/' + file.name);
				await file.mv(uploadPath);
			}));
		}

		// Database operations
		var events = await Events.find().sort([["_id", -1]]).limit(1);
		recordcount = events.length > 0 ? events[0].eventId : 0;

		const {
			eventName,
			eventDetails,
			itinerary,
			highlights,
			FAQ,
			costIncludes,
			costExcludes,
			thingsToCarry,
			pickupPoints,
			eventType,
			location,
			type,
			elevation,
			difficulty,
			endurance,
			duration,
			totalDistance,
			pickupPointsfromMumbai,
			b2bLocaion,
		} = req.body;

		let apiName = req.body.eventName;
		// apiName = apiName?.toString().replace(/\s/g, "-").toLowerCase();
		apiName = apiName?.toString()
			.replace(/\s/g, "-") // Replace spaces with hyphens
			.replace(/-+/g, "-") // Replace multiple consecutive hyphens with a single one
			.toLowerCase(); // Convert the string to lowercase
		console.log('apiName--', apiName);
		const event = new Events({
			name: eventName,
			apiname: apiName,
			eventType: eventType,
			itinerary: itinerary,
			costExcludes: costExcludes,
			eventDetails: eventDetails,
			costIncludes: costIncludes,
			FAQ: FAQ,
			thingsToCarry: thingsToCarry,
			pickupPoints: pickupPoints,
			highlights: highlights,
			eventId: recordcount + 1,
			url: "/create-event/event-details/" + (recordcount + 1),
			images: imageList,
			location: location,
			type: type,
			elevation: elevation,
			difficulty: difficulty,
			endurance: endurance,
			duration: duration,
			totalDistance: totalDistance,
			b2bLocaion: b2bLocaion,
			pickupPointsfromMumbai: pickupPointsfromMumbai
		});

		await event.save();
		res.send({
			eventId: recordcount + 1,
			apiname: apiName,
			isSuccess: true
		});

	} catch (err) {
		console.error(err);
		res.status(500).send({
			isSuccess: false,
			error: err.message
		});
	}
});

// Get current Event Details
router.get("/create-event/event-details/:eventId", async (req, res) => {
	try {
		let event_Id = Number(req.params.eventId.toString().replace(":", ""));
		var events = await Events.find({
			eventId: event_Id
		});
		var imageList = events[0]?.images;
		images = imageList;
		if (events && events.length > 0) {
			res.send({
				isSuccess: true,
				events: events
			});
		} else {
			res.send({
				isSuccess: false
			});
		}
	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

// Delete Event
router.post("/create-event/event-details/:eventId", async (req, res) => {
	//console.log('post create event ');
	try {
		let event_Id = Number(req.params.eventId.toString().replace(":", ""));
		var myquery = {
			eventId: event_Id
		};
		var events = await Events.deleteOne(myquery);
		if (events && events.deletedCount > 0) {
			res.send({
				isSuccess: true
			});
		} else {
			res.send({
				isSuccess: false
			});
		}
	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

// Update Event Details
router.put("/create-event/event-details/:eventId", async (req, res) => {
	try {
		let event_Id = Number(req.params.eventId.toString().replace(":", ""));
		const {
			eventName,
			eventDetails,
			itinerary,
			highlights,
			costIncludes,
			costExcludes,
			FAQ,
			thingsToCarry,
			pickupPoints,
			eventType,
			currentImages,
			location,
			type,
			elevation,
			difficulty,
			endurance,
			duration,
			totalDistance,
			ageGroup,
			trekDistance,
			pickupPointsfromMumbai,
			b2bLocaion,
		} = req.body;

		let imageList = [];
		// Process existing images
		if (currentImages != undefined && !Array.isArray(currentImages)) {
			imageList.push(currentImages.toString().replace("blob:", ""));
		} else if (Array.isArray(currentImages)) {
			for (let img of currentImages) {
				imageList.push(img.toString().replace("blob:", ""));
			}
		}

		// Handle file upload, if files exist
		let sampleFile = req.files?.files;
		if (sampleFile) {
			if (!Array.isArray(sampleFile)) sampleFile = [sampleFile]; // Ensure array for consistency

			for (let file of sampleFile) {
				let uploadPath = path.join(__dirname, '../../public/Images', file.name);
				imageList.push('public/Images/' + file.name);
				await file.mv(uploadPath); // Await each move operation
			}
		}

		// Update query
		let myquery = { eventId: event_Id };
		let options = { upsert: true };
		let updateDoc = {
			name: eventName,
			apiname: eventName?.toString().replace(/\s/g, "-").replace(/-+/g, "-").toLowerCase(),
			itinerary: itinerary,
			eventDetails: eventDetails,
			eventType: eventType,
			costIncludes: costIncludes,
			costExcludes: costExcludes,
			FAQ: FAQ,
			thingsToCarry: thingsToCarry,
			pickupPoints: pickupPoints,
			highlights: highlights,
			images: imageList,
			location: location,
			type: type,
			elevation: elevation,
			difficulty: difficulty,
			endurance: endurance,
			duration: duration,
			totalDistance: totalDistance,
			ageGroup: ageGroup,
			trekDistance: trekDistance,
			b2bLocaion: b2bLocaion,
			pickupPointsfromMumbai: pickupPointsfromMumbai
		};


		// Update and fetch events
		await Events.updateOne(myquery, updateDoc, options);
		let events = await Events.find(myquery);

		// Send response based on existence of events
		if (events && events.length > 0) {
			await updateEventAndScheduleBatches(event_Id, eventName, eventType, eventName?.toString().replace(/\s/g, "-").replace(/-+/g, "-").toLowerCase());
			return res.send({ isSuccess: true, events });
		} else {
			return res.send({ isSuccess: false });
		}

	} catch (error) {
		console.error(error);
		return res.status(500).send({ isSuccess: false, error });
	}
});


// Assuming you are using a MongoDB driver or Mongoose for database operations
async function updateEventAndScheduleBatches(eventId, scheduleName, scheduleEventType, scheduleApiname) {

	// Generate eventApiName and Url
	const eventApiName = scheduleApiname;
	// Find all scheduleBatches related to the updated event
	const scheduleBatchesRecord = await ScheduleBatches.find({ scheduleEventId: eventId });
	// Update each related scheduleBatch record
	const bulkUpdates = scheduleBatchesRecord.map((batch) => {
		const scheduleBatchId = batch._id; // Assume schedule batch record has a unique _id
		const scheduleEventId = batch.eventId;
		const url = "/event-details?eventid=" + scheduleEventId + "/" + eventApiName;
		return {
			updateOne: {
				filter: { _id: scheduleBatchId },
				update: {
					$set: {
						eventname: scheduleName,
						eventType: scheduleEventType,
						eventApi: eventApiName,
						Url: url,
					},
				},
			},
		};
	});

	// Perform bulk update for scheduleBatches
	if (bulkUpdates.length > 0) {
		await ScheduleBatches.bulkWrite(bulkUpdates);
	}

	console.log("Event and related scheduleBatches updated successfully.");
}

export default router;
