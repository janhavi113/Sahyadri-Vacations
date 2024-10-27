// backend/routes/directBookingRoutes.js
import express from 'express';
import path from 'path';
import {
	Events
} from '../models/Event.js';
import { fileURLToPath } from 'url';
const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var recordcount;
var images = {};
// Route to handle file uploads
router.post('/create-event', async (req, res) => {
	console.log('req.body---',req.body);
	var imageList = [];
	let sampleFile = req.files.files;
	if (sampleFile.length == 1) {
		let uploadPath = path.join(__dirname, '../public/Images', sampleFile.name);
		imageList.push('/public/Images/' + sampleFile.name);
		sampleFile.mv(uploadPath, (err) => {
			if (err) {
				return res.status(500).send(err);
			}
		});
	} else {
		for (let i = 0; i < sampleFile.length; i++) {
			let uploadPath = path.join(__dirname, '../public/Images', sampleFile[i].name);
			imageList.push('/public/Images/' +
				sampleFile[i].name);
			sampleFile[0].mv(uploadPath, (err) => {
				if (err) {
					return res.status(500).send(err);
				}
			});
		}

	}

	var events = await Events.find().sort([
		["_id", -1]
	]).limit(1);
	if (events.length > 0) {
		recordcount = events[0].eventId;
	} else {
		recordcount = 0;
	}

	const {
		eventName,
		eventDetails,
		itinerary,
		highlights,
		costIncludes,
		thingsToCarry,
		pickupPoints,
		eventType,
	} = req.body;

	let apiName = req.body.eventName;
	apiName = apiName?.toString().replace(/\s/g, "-").toLowerCase();
	const event = new Events({
		name: eventName,
		apiname: apiName,
		eventType: eventType,
		itinerary: itinerary,
		eventDetails: eventDetails,
		costIncludes: costIncludes,
		thingsToCarry: thingsToCarry,
		pickupPoints: pickupPoints,
		highlights: highlights,
		eventId: recordcount + 1,
		url: "/create-event/event-details/" + (recordcount + 1),
		images: imageList,
	});

	event.save();
	console.log('event----', event);
	res.send({
		eventId: recordcount + 1,
		apiname: apiName,
		isSuccess: true
	});

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
	console.log('post create event ');
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
	console.log('put create event ');
	try {
		let event_Id = Number(req.params.eventId.toString().replace(":", ""));
		const {
			eventName,
			eventDetails,
			itinerary,
			highlights,
			costIncludes,
			thingsToCarry,
			pickupPoints,
			eventType,
			currentImages,
		} = req.body;

		var imageList = [];
		if (currentImages != undefined && !Array.isArray(currentImages)) {
			imageList.push(currentImages.toString().replace("blob:", ""));
		} else if (currentImages != undefined && currentImages.length > 1) {
			for (let index = 0; index < currentImages.length; index++) {
				imageList.push(currentImages[index].toString().replace("blob:", ""));
			}
		}
		var hostname = req.headers.origin;
		let sampleFile = req.files.file;
		console.log('sampleFile', sampleFile);
		for (let i = 0; i < sampleFile.length; i++) {
			let uploadPath = path.join(__dirname, '../public/Images', sampleFile[i].name);
			imageList.push('/public/Images/' + sampleFile[i].name);
			sampleFile[0].mv(uploadPath, (err) => {
				if (err) {
					return res.status(500).send(err);
				}
			});
		}
		console.log('imageList', imageList);
		var myquery = {
			eventId: event_Id
		};
		var options = {
			upsert: true
		};
		var updateDoc = {
			name: eventName,
			itinerary: itinerary,
			eventDetails: eventDetails,
			eventType: eventType,
			costIncludes: costIncludes,
			thingsToCarry: thingsToCarry,
			pickupPoints: pickupPoints,
			highlights: highlights,
			images: imageList,
		};
		var events = await Events.updateOne(myquery, updateDoc, options);
		events = await Events.find(myquery);
		console.log('events--', events);
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
}
);
export default router;
