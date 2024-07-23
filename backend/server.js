import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { Employee } from './models/Employee.js';
import { ScheduleBatches } from './models/ScheduleBatches.js';
import { Events } from './models/Event.js';
import { Bookings } from './models/Bookings.js';
import { CustomisedRequest } from './models/CustomisedRequest.js';
import main from './mongo.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();
let clientSecret = process.env.MONGOODB_CLIENT_SECRET;
let clientId = process.env.MONGOODB_CLIENT_ID;
let refreshToken = process.env.MONGOODB_REFRESH_TOKEN;
const app = express();
const port = process.env.PORT || 3000;
var images = {};
var recordcount;

app.use(cors({
  origin: ['http://157.173.222.166', 'http://localhost', 'http://127.0.0.1'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new Employee({ Username: username, Password: hashedPassword });
  await user.save();
  res.send('User registered!');
});

app.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;
  let userDetails = await Employee.findOne({ Username: username });
  if (!userDetails) {
    return res.status(400).send('Invalid credentials');
  } else {
    let userPassword = JSON.parse(JSON.stringify(userDetails)).Password;
    const isPasswordValid = await bcrypt.compare(password, userPassword);
    if (!isPasswordValid) return res.status(400).send('Invalid credentials');
    const token = jwt.sign({ userId: userDetails._id }, process.env.JWT_SECRET);
    res.json({ token });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/root/Sahyadri-Vacations/public/Images/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 1MB file size limit
});

function handleError(err, res) {
  res.status(500).contentType("text/plain").end("Something went wrong!");
}

app.post('/create-event', upload.array('file', 12), (req, res) => {
  if (!req.files) {
    return res.status(400).send('No files were uploaded.');
  }
  console.log(req.files);
  res.send({ isSuccess: true, message: 'Files uploaded successfully' });
});

app.use('/api', cors({
  origin: ['http://157.173.222.166', 'http://localhost', 'http://127.0.0.1'],
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
}));

app.get("/show-all-events", async (req, res) => {
  try {
    let ScheduleBatchesRecords = await ScheduleBatches.find({ active: true });
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.get("/scheduled-events", async (req, res) => {
  try {
    let ScheduleBatchesRecords = await ScheduleBatches.find({});
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
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
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.get("/event-details/eventid/:eventId/:apiName", async (req, res) => {
  let event_Id = req.params.eventId;
  let apiname = req.params.apiName;
  var events = await Events.findOne({ apiname: apiname });
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
    res.send({ isSuccess: false });
  }
});

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
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.get("/create-event/event-details/:eventId", async (req, res) => {
  try {
    let event_Id = Number(req.params.eventId.toString().replace(":", ""));
    var events = await Events.find({ eventId: event_Id });
    var imageList = events[0]?.images;
    images = imageList;
    if (events && events.length > 0) {
      res.send({ isSuccess: true, events: events });
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.post("/create-event/event-details/:eventId", async (req, res) => {
  try {
    let event_Id = Number(req.params.eventId.toString().replace(":", ""));
    var myquery = { eventId: event_Id };
    var events = await Events.deleteOne(myquery);
    if (events && events.deletedCount > 0) {
      res.send({ isSuccess: true });
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false });
  }
});

app.put("/create-event/event-details/:eventId", upload.array("file", 12), async (req, res) => {
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
      imageList.push(currentImages.toString());
    } else {
      imageList = currentImages;
    }

    if (req.files.length > 0) {
      req.files.forEach((element) => {
        let filename = element.path.toString().replace("/root/Sahyadri-Vacations/public", "");
        imageList.push(filename);
      });
    } else if (req.files.length == 0 && (imageList == undefined || imageList.length == 0)) {
      imageList = images;
    }

    var newvalues = {
      $set: {
        eventId: event_Id,
        eventApi: eventName.toLowerCase(),
        eventName: eventName,
        eventDetails: eventDetails,
        itinerary: itinerary,
        highlights: highlights,
        costIncludes: costIncludes,
        thingsToCarry: thingsToCarry,
        pickupPoints: pickupPoints,
        eventType: eventType,
        images: imageList,
      },
    };

    var events = await Events.updateOne({ eventId: event_Id }, newvalues, { upsert: true });
    if (events) {
      res.send({ isSuccess: true });
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.get("/customized-booking-requests", async (req, res) => {
  try {
    var CustomisedRequestsRecords = await CustomisedRequest.find({});
    res.send({ isSuccess: true, requests: CustomisedRequestsRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.post("/customized-booking-requests", async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      whatsappNumber,
      selectDate,
      tripType,
      destination,
      duration,
      budget,
      numberOfPeoples,
      moreDetails,
    } = req.body;

    const customizedRequest = new CustomisedRequest({
      name: fullName,
      email: emailId,
      mobileNumber: whatsappNumber,
      selectDate: selectDate,
      tripType: tripType,
      destination: destination,
      duration: duration,
      budget: budget,
      numberOfPeoples: numberOfPeoples,
      moreDetails: moreDetails,
      status: "new",
    });

    customizedRequest.save();
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.post("/scheduled-batches/:eventId", async (req, res) => {
  try {
    const { eventId, fromDate, toDate, batchId } = req.body;

    const scheduledBatch = new ScheduleBatches({
      eventId: eventId,
      fromDate: fromDate,
      toDate: toDate,
      batchId: batchId,
      active: true,
    });

    scheduledBatch.save();
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
