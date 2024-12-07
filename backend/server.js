import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import https from 'https';
import {
	Employee
} from './models/Employee.js';
import {
	ScheduleBatches
} from './models/ScheduleBatches.js';
import {
	Events
} from './models/Event.js';
import {
	Bookings
} from './models/Bookings.js';

import {
	CustomisedRequest
} from './models/CustomisedRequest.js';
import main from './mongo.js';
import fs from 'fs';
import path from 'path';
import {
	fileURLToPath
} from 'url';
import multer from 'multer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import directBookingRoutes from './routes/directBookingRoutes.js'; // Import the new route
import bookingRoutes from './routes/bookingRoutes.js'; // Import the new route
import createEventRoutes from './routes/createEventRoutes.js'; // Import the new route
import scheduleEventRoutes from './routes/scheduleEventRoutes.js'; // Import the new route
import showAllEventsRoutes from './routes/showAllEventsRoutes.js'; // Import the new route
import paymentRoutes from './routes/paymentRoutes.js';
import paymentCallbackRoutes from './routes/paymentCallbackRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import customisedTourRoutes from './routes/customisedTourRoutes.js'
import specialOfferRoutes from './routes/specialOfferRoutes.js'
import './cron/specialOfferCleanup.js';
 
dotenv.config();
let clientSecret = process.env.MONGOODB_CLIENT_SECRET; // Fixed typo in variable name
let clientId = process.env.MONGOODB_CLIENT_ID;
let refreshToken = process.env.MONGOODB_REFRESH_TOKEN;
const app = express();
const port = process.env.PORT || 3000;
var images = {};
var recordcount;
app.use(cors({}));

// CORS configuration
app.use(cors({
	origin: ['http://sahyadrivacations.com', 'http://www.sahyadrivacations.com', 'http://157.173.222.166', 'http://localhost', 'http://127.0.0.1'], // Allow frontend IP and localhost
	methods: 'GET,POST,PUT,DELETE,OPTIONS',
	allowedHeaders: 'Content-Type, Authorization',
	credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); // Parse URL-encoded bodies
const __filename = fileURLToPath(
	import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, '../public')));

const frontendDir = path.join(__dirname, "../frontend/dist");
console.log("Frontend directory:", frontendDir);

if (fs.existsSync(frontendDir)) {
	console.log("Frontend directory exists:");
	fs.readdirSync(frontendDir).forEach(file => {
		console.log(file);
	});
} else {
	console.log("Frontend directory does not exist");
}

app.use(express.static(frontendDir));
// Middleware to protect routes

const auth = (req, res, next) => {
	const token = req.header('Authorization');
	if (!token) return res.status(401).send('Access denied');
	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
		next();
	} catch (err) {
		res.status(400).send('Invalid token');
	}
};

// Register route
app.post('/register', async (req, res) => {

	const {
		username,
		password
	} = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	const user = new Employee({
		Username: username,
		Password: hashedPassword
	});
	await user.save();
	res.send('User registered!');
});

// Login route

app.post('/admin-login', async (req, res) => {
	const {
		username,
		password
	} = req.body;
	let userDetails = await Employee.findOne({
		Username: username
	});

	if (!userDetails) {
		return res.status(400).send('Invalid credentials');
	} else {
		let userPassword = JSON.parse(JSON.stringify(userDetails)).Password;
		const isPasswordValid = await bcrypt.compare(password, userPassword);
		if (!isPasswordValid) return res.status(400).send('Invalid credentials');
		const token = jwt.sign({
			userId: userDetails._id
		}, process.env.JWT_SECRET);

		res.json({
			token
		});
	}
});

// Set up storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, '/root/Sahyadri-Vacations/public/Images/'); // Directory to save uploaded files
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
	}
});

// Initialize multer with storage options
const upload = multer({
	storage: storage
});

// Error handling middleware
function handleError(err, res) {
	res.status(500).contentType("text/plain").end("Something went wrong!");
}

app.use(fileUpload());

//Add the API route with the correct CORS settings
app.use('/api', cors({
	origin: ['http://sahyadrivacations.com', 'http://www.sahyadrivacations.com', 'http://157.173.222.166', 'http://localhost', 'http://127.0.0.1'],
	methods: 'GET,POST,PUT,DELETE,OPTIONS',
	allowedHeaders: 'Content-Type, Authorization',
	credentials: true,
}));

async function updateExpiredBookings() {
    try {
        const currentDate = new Date();
        const result = await Bookings.updateMany(
            { eventEndDate: { $lt: currentDate }, active: true },
            { $set: { active: false } }
        );
    } catch (error) {
        console.error("Error updating records:", error);
    }
}
 
app.get("/show-all-bookings", async (req, res) => {
	try {
		updateExpiredBookings();
		let bookings = await Bookings.find({ active: true });
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

app.get("/schedule-event-details", async (req, res) => {
	try {
		let bookings = await Bookings.find({});
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

app.get("/scheduled-events", async (req, res) => {
	try {
		let ScheduleBatchesRecords = await ScheduleBatches.find({});
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

app.get("/search-event/:serchText", async (req, res) => {
	try {
		
		let ScheduleBatchesRecords = await ScheduleBatches.find({
			active: true,
			eventApi: {
				$regex: ".*" + req.params.serchText.toLowerCase() + ".*",
			},
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

app.get("/delete-scheduled-events/eventid/:eventId", async (req, res) => {
	let event_Id = req.params.eventId;
	try {
		var myquery = {
			eventId: event_Id
		};
		var events = await ScheduleBatches.deleteOne(myquery);
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
app.get("/event-details/eventid/:eventId/:apiName", async (req, res) => {
	let event_Id = req.params.eventId;
	let apiname = req.params.apiName;
	var events = await Events.findOne({
		apiname: apiname
	});
	let ScheduleBatchesRecords = await ScheduleBatches.findOne({
		eventId: event_Id,
	});
	
	if (events && ScheduleBatchesRecords) {
		
		res.send({
			isSuccess: true,
			events: events,
			ScheduleBatchesRecords: ScheduleBatchesRecords,
		});
	} else {
		res.send({
			isSuccess: false
		});
	}
});

// Login to System
app.post("/event-details/eventid/:eventId/:apiName", async (req, res) => {
	try {
		const {
			fullName,
			emailId,
			whatsappNumber,
			selectDate,
			eventId,
			eventName,
			numberOfPeoples,
			amountPaid,
		} = req.body;

		const bookingRequest = new Bookings({
			name: fullName,
			mobileNumber: whatsappNumber,
			batch: selectDate,
			eventId: eventId,
			eventName: eventName,
			numberOfPeoples: numberOfPeoples,
			email: emailId,
			amountPaid: amountPaid,
			status: "new",
		});

		bookingRequest.save();
		res.send({
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

// Get All Event
app.get("/all-events", async (req, res) => {
	try {
		var events = await Events.find({});
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


app.use(createEventRoutes);
app.use(bookingRoutes);
app.use(scheduleEventRoutes);
app.use(showAllEventsRoutes);
app.use(customisedTourRoutes);
app.use(specialOfferRoutes);
// Use the payment routes

// Use the separated routes
// Use the route
app.use(directBookingRoutes);
app.use(couponRoutes);

// Use the payment route
app.use('/api', paymentRoutes);
app.use('/api', paymentCallbackRoutes);

// Handle all other routes and serve index.html
app.get("*", (req, res) => {
	const indexPath = path.join(frontendDir, "index.html");
	if (fs.existsSync(indexPath)) {
		res.sendFile(indexPath);
	} else {
		console.error("index.html not found in frontend directory");
		res.status(404).send("404 Not Found");
	}
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		return res.status(400).json({
			error: err.message
		});
	} else if (err) {
		return res.status(500).json({
			error: err
		});
	}
	next();
});

if (process.env.NODE_ENV == 'production') {
const options = {
	key: fs.readFileSync('/etc/letsencrypt/live/sahyadrivacations.com/privkey.pem'),
	cert: fs.readFileSync('/etc/letsencrypt/live/sahyadrivacations.com/fullchain.pem'),
  };

 // Start the HTTPS server
const server = https.createServer(options, app);
console.log('server',server);
server.listen(3001, () => {
  console.log('HTTPS Server running on port 3001');
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
}else{
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
}