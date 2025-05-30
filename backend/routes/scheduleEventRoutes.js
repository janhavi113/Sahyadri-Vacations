// backend/routes/scheduleEvent.js
import express from 'express';
import path from 'path';
import {
	ScheduleBatches
} from '../models/ScheduleBatches.js';
import {
	Events
} from '../models/Event.js';
import {
	MainCategoriesSection
} from '../models/MainCategoriesSection.js';

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

router.get("/schedule-event-to-update/:eventId", async (req, res) => {
	try {
		let event_Id = req.params.eventId;
		var events = await Events.find({});
		var scheduleBatch = await ScheduleBatches.find({ eventId: event_Id });
		res.send({
			isSuccess: true,
			events: events,
			scheduleBatch: scheduleBatch
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
			scheduleEventId,
			eventname,
			eventType,
			eventCostPerPerson,
			eventEndDate,
			eventStartDate,
			eventBatchCount,
			everyWeekend,
			notScheduleYet,
			b2bPrice,
			eventCostPerPersonFromMumbai,
			bookingTillDate,
			bookingTillTime,
			specialOfferEvent,
			partialBookingAmount,
			doubleSharing,
            doubleSharingNote,
            tripalSharing,
            tripalSharingNote,
            thirdAcUpgrate,
            thirdAcUpgrateNote,
            note,
			duration
		} = req.body;

		let scheduleRecordcount = 0;
		const latest = await ScheduleBatches.findOne({
			notScheduleYet: false,
			everyWeekend: false
		}).sort({ sort: -1 });

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
			scheduleEventId: scheduleEventId,
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
			duration:duration,
			images: currUrl,
			eventCostPerPersonFromMumbai: eventCostPerPersonFromMumbai,
			specialOfferEvent: specialOfferEvent,
			partialBookingAmount: partialBookingAmount,
			doubleSharing: doubleSharing,
			doubleSharingNote: doubleSharingNote,
			tripalSharing: tripalSharing,
			tripalSharingNote: tripalSharingNote,
			thirdAcUpgrate: thirdAcUpgrate,
			thirdAcUpgrateNote: thirdAcUpgrateNote,
			note: note,
			Url: "/event-details?eventid=" +
				(scheduleRecordcount + 1).toString() +
				"/" +
				eventname.toString()
					.replace(/\s/g, "-") // Replace spaces with hyphens
					.replace(/-+/g, "-")
					.replace("&", "") // Replace multiple consecutive hyphens with a single one
					.toLowerCase(),
			eventType: eventType,
			eventApi: eventname.toString()
				.replace(/\s/g, "-") // Replace spaces with hyphens
				.replace(/-+/g, "-")
				.replace("&", "") // Replace multiple consecutive hyphens with a single one
				.toLowerCase(),
		});
		scheduleBatches.sort = latest ? latest.sort + 1 : 1;
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

router.post("/create-categories", async (req, res) => {
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

		const {
			active,
			title,
			events,
			startingPrice
		} = req.body;

		
		const MainCategories = new MainCategoriesSection({
			active: active,
			title: title,
			events:events,
			imagePath:currUrl,
			startingPrice:startingPrice
		});
		
		MainCategories.save();
		if (MainCategories._id) {
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

router.post("/update-schedule-events/:eventId", async (req, res) => {
	try {

		let event_Id = req.params.eventId;
		var currUrl = "";
		if (req.files != null) {
			let sampleFile = req.files.file;
			let uploadPath = path.join(__dirname, '../../public/Images', sampleFile.name);
			currUrl = 'public/Images/' + sampleFile.name;
			sampleFile.mv(uploadPath, (err) => {
				if (err) {
					return res.status(500).send(err);
				}
			});
		} else {
			currUrl = req.body.file;
		}

		const {
			active,
			scheduleEventId,
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
			partialBookingAmount,
			doubleSharing,
            doubleSharingNote,
            tripalSharing,
            tripalSharingNote,
            thirdAcUpgrate,
            thirdAcUpgrateNote,
            note,
			duration,
			
		} = req.body;

        console.log('req.body---',req.body);
		console.log('notScheduleYet--',notScheduleYet);
		let redirectionUrl;

		if(notScheduleYet && notScheduleYet != 'false'){
           redirectionUrl = "/show-event-details?eventid=" + event_Id.toString() + "/" + eventname.toString().replace(/\s/g, "-").replace(/-+/g, "-").toLowerCase();
		}else{
			redirectionUrl = "/event-details?eventid=" + event_Id.toString() + "/" + eventname.toString().replace(/\s/g, "-").replace(/-+/g, "-").toLowerCase();
		
		}

		// Update query
		let myquery = { eventId: event_Id };
		let options = { upsert: true };
		let updateDoc = {
			active: active,
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
			duration:duration,
			specialOfferEvent: specialOfferEvent,
			partialBookingAmount: partialBookingAmount,
			eventType: eventType,
			scheduleEventId: scheduleEventId,
			doubleSharing: doubleSharing,
			doubleSharingNote: doubleSharingNote,
			tripalSharing: tripalSharing,
			tripalSharingNote: tripalSharingNote,
			thirdAcUpgrate: thirdAcUpgrate,
			thirdAcUpgrateNote: thirdAcUpgrateNote,
			note: note,
			Url: redirectionUrl,
			eventApi: eventname.toString().replace(/\s/g, "-").replace(/-+/g, "-").toLowerCase()
		};

		// Update and fetch events
		await ScheduleBatches.updateOne(myquery, updateDoc, options);
		let events = await ScheduleBatches.find(myquery);

		res.send({
			isSuccess: true,
			events: events
		});

	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

// Update sort order of batches
router.post("/update-sort-order", async (req, res) => {
	const { batches } = req.body;

	try {
		// Update each batch's sort field
		for (const batch of batches) {
			await ScheduleBatches.findByIdAndUpdate(batch._id, { sort: batch.sort });
		}
		res.json({ success: true, message: "Sort order updated successfully" });
	} catch (error) {
		console.error("Error updating sort order:", error);
		res.status(500).json({ error: "Failed to update sort order" });
	}
});

export default router;
