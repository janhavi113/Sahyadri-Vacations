import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import nodemailer from "nodemailer"
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
import { Console } from "console";

const app = express()
const port = 3000;
var images = {};
var recordcount;
app.use(cors())
app.use(bodyParser.json())
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
app.get('/', async(req, res) => {
  try{
  let ScheduleBatchesRecords = await ScheduleBatches.find({ active: true });
  res.send({isSuccess : true, events :ScheduleBatchesRecords});
}catch (error) {
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
  console.log('req.params--',req.params);
  let event_Id = req.params.eventId;
  let apiname = req.params.apiName;
  var events = await Events.findOne({eventId : event_Id ,apiname : apiname })
  let ScheduleBatchesRecords = await ScheduleBatches.findOne({ eventId : event_Id  });
  if(events  && ScheduleBatchesRecords ){
    console.log('event_Id--',events ,'ScheduleBatchesRecords',ScheduleBatchesRecords);
      res.send({ isSuccess: true, events: events ,ScheduleBatchesRecords : ScheduleBatchesRecords})
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
      eventName:eventName,
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
   // console.log('events', events);
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
   // console.log('event_Id'+event_Id);
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
      eventType,
      highlights,
      costIncludes,
      thingsToCarry,
      pickupPoints,
      currentImages
    } = req.body;
    var imageList = [];
    if (currentImages != undefined && !Array.isArray( currentImages)) {      
      imageList.push(currentImages.toString().replace('blob:',''));
    } else if (currentImages != undefined && currentImages.length > 1) {      
      for (let index = 0; index < currentImages.length; index++) {
       // console.log('currentImages['+index+'].toString().replace(blob:)'+currentImages[index])
    
     // console.log('currentImages['+index+'].toString().replace(blob:)'+currentImages[index].toString().replace('blob:',''))
        imageList.push(currentImages[index].toString().replace('blob:',''));
      }
    }
    var hostname = req.headers.origin;
   
    for (let index = 0; index < req.files.length; index++) {
     // console.log('req.files['+index+'].path--'+req.files[index].path);
      imageList.push(hostname + "/" + req.files[index].path.toString().replaceAll('\\', '/'));
    }
  

    var myquery = { eventId: event_Id };
    var options = { upsert: true };
    var updateDoc = {
      name: eventName,
      itinerary: itinerary,
      eventDetails: eventDetails,
      eventType:eventType,
      costIncludes: costIncludes,
      thingsToCarry: thingsToCarry,
      pickupPoints: pickupPoints,
      highlights: highlights,
      images: imageList
    };
    var events = await Events.updateOne(myquery, updateDoc, options);
    events = await Events.find(myquery);
   //console.log('events --',events);
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
    var imageList = [];
    var currUrl = req.headers.origin;
    for (let index = 0; index < req.files.length; index++) {
      imageList.push(currUrl + "/" + req.files[index].path.toString().replaceAll('\\', '/'));
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
      pickupPoints
    } = req.body;

    let apiName = req.body.eventName;
    apiName = apiName.toString().replace(/\s/g, '-');
    const event = new Events({
      name: eventName,
      apiname: apiName,
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
    var currUrl ='';
    if (req.file) {
      currUrl = req.headers.origin + "/" + req.file.path.toString().replaceAll('\\', '/');
    }
    const {
      active,
      eventId,
      eventname,
      batches,
    } = req.body;
    var batchList = [];
    if(Array.isArray(batches)){
    for (let i = 0; i < batches.length; i++) {
      batchList.push(JSON.parse(batches[i]));
    }
  }else{
    batchList.push(JSON.parse(batches));
  }
    const scheduleBatches = new ScheduleBatches({
      active: active,
      eventId: eventId,
      batches: batchList,
      eventname: eventname,
      images: currUrl
    });

    scheduleBatches.save();
    res.send({ isSuccess: true });
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

//Customised Tour
app.post('/customised-tour', async (req, res) => {
 // console.log('req.body', req.body);
 // console.log('req.body', req.file);
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

app.listen(port, () => {
 // console.log(`Example app listening on port ${port}`)
})

