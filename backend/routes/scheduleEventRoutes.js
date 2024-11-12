// backend/routes/scheduleEvent.js
import express from 'express';
import path from 'path';
import {
	ScheduleBatches
} from '../models/ScheduleBatches.js';
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
// Get All Event
router.get("/schedule-event", async (req, res) => {
	try {
		var events = await Events.find({});
		var scheduleBatches = await ScheduleBatches.find({});
		res.send({
			isSuccess: true,
			events: events,
			scheduleBatches: scheduleBatches
		});
	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

router.post("/schedule-event", async (req, res) => {
	try {

		var currUrl = "";
		let sampleFile = req.files.file;
		let uploadPath = path.join(__dirname, '../../public/Images', sampleFile.name);
		currUrl = 'public/Images/' + sampleFile.name;
		sampleFile.mv(uploadPath, (err) => {
			if (err) {
				return res.status(500).send(err);
			}
		});

		console.log("schedule-event --", req.body);
		const {
			active,
			eventId,
			eventname,
			eventType,
			eventCostPerPerson,
			eventEndDate,
			eventStartDate,
			eventBatchCount,
			everyWeekend,
			notScheduleYet,
			b2bPrice,
			bookingTillDate,
			bookingTillTime,
			specialOfferEvent,
		} = req.body;

		let scheduleRecordcount = 0;
		var events = await ScheduleBatches.find().sort([
			["_id", -1]
		]).limit(1);
		if (events.length > 0) {
			scheduleRecordcount = events[0].eventId;
		} else {
			scheduleRecordcount = 0;
		}
		const scheduleBatches = new ScheduleBatches({
			active: active,
			eventId: scheduleRecordcount + 1,
			eventCostPerPerson: eventCostPerPerson,
			eventEndDate: eventEndDate,
			eventStartDate: eventStartDate,
			eventBatchCount: eventBatchCount,
			everyWeekend: everyWeekend,
			notScheduleYet: notScheduleYet,
			b2bPrice: b2bPrice,
			bookingTillDate: bookingTillDate,
			bookingTillTime: bookingTillTime,
			eventname: eventname,
			images: currUrl,
			specialOfferEvent:specialOfferEvent,
			Url: "/event-details?eventid=" +
				(scheduleRecordcount + 1).toString() +
				"/" +
				eventname.toString().replace(/\s/g, "-").toLowerCase(),
			eventType: eventType,
			eventApi: eventname.toString().replace(/\s/g, "-").toLowerCase(),
		});

		scheduleBatches.save();
		if (scheduleBatches._id) {
			res.send({
				isSuccess: true
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

export default router;
