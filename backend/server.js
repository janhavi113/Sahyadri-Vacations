import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import nodemailer from "nodemailer"
import google from "googleapis"
import mongoose from "mongoose";
import { Employee } from "./models/Employee.js";
import { ScheduleBatches } from "./models/ScheduleBatches.js";
import { Events } from "./models/Event.js";
import { Bookings } from "./models/Bookings.js";
import { CustomisedRequest } from "./models/CustomisedRequest.js";
import main from "./mongo.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();
let clientSceret = process.env.MONGOODB_CLIENT_SCERET;
let clientId = process.env.MONGOODB_CLIENT_ID;
let refreshToken = process.env.MONGOODB_REFRESH_TOKEN;
const app = express();
const port = process.env.PORT || 3000;
var images = {};
var recordcount;
app.use(cors())
app.use(bodyParser.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Assuming your frontend folder is at the same level as your backend folder
//const frontendDir = path.join(__dirname, '../frontend/dist');
//console.log('Frontend directory:', frontendDir);
// Serve static files from the frontend dist directory
 //app.use(express.static(frontendDir));


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/Images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + path.extname(file.originalname)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })
app.get('/', async (req, res) => {
  console.log('i am in');
  try {
    let ScheduleBatchesRecords = await ScheduleBatches.find({ active: true });
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

app.get('/scheduled-events', async (req, res) => {
  try {
    let ScheduleBatchesRecords = await ScheduleBatches.find({  });
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

app.get('/search-event/:serchText', async (req, res) => {
  try {
    console.log('req.params--', req.params.serchText);

    console.log('serchText--', { $regex: '.*' + req.params.serchText.toLowerCase() + '.*' });
    let ScheduleBatchesRecords = await ScheduleBatches.find({ active: true, eventApi: { $regex: '.*' + req.params.serchText.toLowerCase() + '.*' } });
    console.log('ScheduleBatchesRecords--', ScheduleBatchesRecords);
    res.send({ isSuccess: true, events: ScheduleBatchesRecords });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

//Login to System
app.post('/admin-login', async (req, res) => {
  let employee = await Employee.find({ Username: req.body.username });
  res.send(employee);
})
app.get('/event-details/eventid/:eventId/:apiName', async (req, res) => {
  console.log('req.params--', req.params);
  let event_Id = req.params.eventId;
  let apiname = req.params.apiName;
  var events = await Events.findOne({ apiname: apiname })
  let ScheduleBatchesRecords = await ScheduleBatches.findOne({ eventId: event_Id });
  if (events && ScheduleBatchesRecords) {
    console.log('event_Id--', events, 'ScheduleBatchesRecords', ScheduleBatchesRecords);
    res.send({ isSuccess: true, events: events, ScheduleBatchesRecords: ScheduleBatchesRecords })
  } else {
    res.send({ isSuccess: false });
  }
})
//Login to System
app.post('/event-details/eventid/:eventId/:apiName', async (req, res) => {
  console.log(req.body);
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
      status: 'new'

    });

    bookingRequest.save();
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})
// Get current Event Details 
app.get('/create-event/event-details/:eventId', async (req, res) => {

  try {
    let event_Id = Number(req.params.eventId.toString().replace(':', ''));
    var events = await Events.find({ eventId: event_Id })
    var imageList = events[0]?.images;
    images = imageList;
     if (events && events.length > 0) {
      res.send({ isSuccess: true, events: events })
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

// Delete Event 
app.post('/create-event/event-details/:eventId', async (req, res) => {
  try {
    let event_Id = Number(req.params.eventId.toString().replace(':', ''));
    var myquery = { eventId: event_Id };
    var events = await Events.deleteOne(myquery);
    if (events && events.length > 0) {
      res.send({ isSuccess: true, events: events })
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

// Update Event Details
app.put('/create-event/event-details/:eventId', upload.array('file', 12), async (req, res) => {
  try {
    let event_Id = Number(req.params.eventId.toString().replace(':', ''));
    const {
      eventName,
      eventDetails,
      itinerary,
      highlights,
      costIncludes,
      thingsToCarry,
      pickupPoints,
      eventType,
      currentImages
    } = req.body;

    var imageList = [];
    if (currentImages != undefined && !Array.isArray(currentImages)) {
      imageList.push(currentImages.toString().replace('blob:', ''));
    } else if (currentImages != undefined && currentImages.length > 1) {
      for (let index = 0; index < currentImages.length; index++) {
          imageList.push(currentImages[index].toString().replace('blob:', ''));
      }
    }
    var hostname = req.headers.origin;

    for (let index = 0; index < req.files.length; index++) {
      imageList.push(hostname + "/" + req.files[index].path.toString().replaceAll('\\', '/'));
    }


    var myquery = { eventId: event_Id };
    var options = { upsert: true };
    var updateDoc = {
      name: eventName,
      itinerary: itinerary,
      eventDetails: eventDetails,
      eventType: eventType,
      costIncludes: costIncludes,
      thingsToCarry: thingsToCarry,
      pickupPoints: pickupPoints,
      highlights: highlights,
      images: imageList
    };
    var events = await Events.updateOne(myquery, updateDoc, options);
    events = await Events.find(myquery);
      if (events && events.length > 0) {
      res.send({ isSuccess: true, events: events })
    } else {
      res.send({ isSuccess: false });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

// Get All Event
app.get('/all-events', async (req, res) => {
  try {
    var events = await Events.find({})
    res.send({ isSuccess: true, events: events });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

// Create Event 
app.post('/create-event', upload.array('file', 12), async (req, res) => {
  try {
    console.log('create req.body --', req.body);
    var imageList = [];
    var currUrl = req.headers.origin;
    if (req.files) {
      for (let index = 0; index < req.files.length; index++) {
        imageList.push(currUrl + "/" + req.files[index].path.toString().replaceAll('\\', '/'));
      }
    }

    var events = await Events.find().sort([['_id', -1]]).limit(1)
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
      eventType
    } = req.body;
    console.log('create req.body --', req.body);
    let apiName = req.body.eventName;
    apiName = apiName.toString().replace(/\s/g, '-').toLowerCase();
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
      url: currUrl + "/create-event/event-details/" + (recordcount + 1),
      images: imageList

    });

    event.save();
    res.send({ eventId: recordcount + 1, apiname: apiName, isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }

})

// Get All Event
app.get('/schedule-event', async (req, res) => {
  try {
    var events = await Events.find({});
    var scheduleBatches = await ScheduleBatches.find({});
    res.send({ isSuccess: true, events: events, scheduleBatches: scheduleBatches });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

app.post('/schedule-event', upload.single('file'), async (req, res) => {
  try {

    var currUrl = '';
    if (req.file) {
      currUrl = req.headers.origin + "/" + req.file.path.toString().replaceAll('\\', '/');
    }
    console.log('schedule-event --', req.body);
    const {
      active,
      eventId,
      eventname,
      batches,
      eventType,
    } = req.body;
    var batchList = [];
    if (Array.isArray(batches)) {
      for (let i = 0; i < batches.length; i++) {
        batchList.push(JSON.parse(batches[i]));
      }
    } else {
      batchList.push(JSON.parse(batches));
    }
    let scheduleRecordcount = 0;
    var events = await ScheduleBatches.find().sort([['_id', -1]]).limit(1)
    if (events.length > 0) {
      scheduleRecordcount = events[0].eventId;
    } else {
      scheduleRecordcount = 0;
    }
    const scheduleBatches = new ScheduleBatches({
      active: active,
      eventId: scheduleRecordcount + 1,
      batches: batchList,
      eventname: eventname,
      images: currUrl,
      Url: '/event-details?eventid=' + (scheduleRecordcount + 1).toString() + '/' + eventname.toString().replace(/\s/g, '-').toLowerCase(),
      eventType: eventType,
      eventApi: eventname.toString().replace(/\s/g, '-').toLowerCase()
    });

    scheduleBatches.save();
    if (scheduleBatches._id) {
      res.send({ isSuccess: true });
    }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

//Customised Tour
app.post('/customised-tour', async (req, res) => {
   try {
    const {
      name,
      phone,
      traveldate,
      durationoftour,
      numberofpeople,
      email,
      message,
    } = req.body;

    const customisedRequest = new CustomisedRequest({
      name: name,
      phone: phone,
      traveldate: traveldate,
      durationoftour: durationoftour,
      numberofpeople: numberofpeople,
      email: email,
      message: message,
      status: 'new'

    });

    customisedRequest.save();
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})
// Bookings
app.post('/booking', async (req, res) => {
  try {
    console.log('create req.body --', req.body);

    const {
      fullName,
      numberOfPeoples,
      amountPaid,
      eventId,
      eventName,
      batch,
      emailId,
      whatsappNumber,
      selectDate
    } = req.body;
    console.log('create req.body --', req.body);

    const booking = new Bookings({
      name: fullName,
      email: emailId,
      mobileNumber: whatsappNumber,
      batch: batch,
      eventId: eventId,
      eventName: eventName,
      numberOfPeoples: numberOfPeoples,
      amountPaid: amountPaid,
    });

    booking.save();
    
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }

})

// Handle all other routes and serve index.html
app.get('*', (req, res) => {
  console.log('path--',path.join(frontendDir, 'index.html'));
  res.sendFile(path.join(frontendDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});