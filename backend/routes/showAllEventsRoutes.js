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
router.get("/show-all-events", async (req, res) => {
	console.log("i am in");
	try {
		let ScheduleBatchesRecords = await ScheduleBatches.find({
			active: true
		});
		res.send({
			isSuccess: true,
			events: ScheduleBatchesRecords
		});
	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

router.get("/show-events/:eventType", async (req, res) => {
	
	try {
		let eventType = req.params.eventType;
		console.log("eventType---",eventType);
		let ScheduleBatchesRecords = await ScheduleBatches.find({
			active: true,
			eventType: eventType
		});
		console.log("ScheduleBatchesRecords---",ScheduleBatchesRecords);
		res.send({
			isSuccess: true,
			events: ScheduleBatchesRecords
		});
	} catch (error) {
		console.error(error);
		res.send({
			isSuccess: false,
			error: error
		});
	}
});

export default router;
