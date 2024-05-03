import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose";
import { Employee } from "./models/Employee.js";
import { ScheduleBatches } from "./models/ScheduleBatches.js";
import { Events } from "./models/Event.js";
import main from "./mongo.js";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

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
app.get('/', (req, res) => {
  res.send('Hello World!')
})

//Login to System
app.post('/admin-login', async (req, res) => {
  let employee = await Employee.find({ Username: req.body.username });
  res.send(employee);
})

// Get current Event Details 
app.get('/create-event/event-details/:eventId', async (req, res) => {

  try {
    let event_Id = Number(req.params.eventId.toString().replace(':', ''));
    var events = await Events.find({ eventId: event_Id })
    var imageList = events[0]?.images;
    images = imageList;
    console.log('events',events);
    if(events && events.length > 0){
    res.send({ isSuccess: true, events: events })
     }else{
      res.send({ isSuccess: false});
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
    if(events && events.length > 0){
      res.send({ isSuccess: true, events: events })
       }else{
        res.send({ isSuccess: false});
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
      currentImages
    } = req.body;
    var imageList = [];
    if (currentImages != undefined && currentImages.length == 1) {
      imageList.push(currentImages);
    } else if (currentImages != undefined && currentImages.length > 1) {
      for (let index = 0; index < currentImages.length; index++) {
        imageList.push(currentImages[index]);
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
      costIncludes: costIncludes,
      thingsToCarry: thingsToCarry,
      pickupPoints: pickupPoints,
      highlights: highlights,
      images: imageList
    };
    var events = await Events.updateOne(myquery, updateDoc, options);
    if(events && events.length > 0){
      res.send({ isSuccess: true, events: events })
       }else{
        res.send({ isSuccess: false});
       }
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

// Get All Event
app.get('/all-events', async (req, res) => {
  try {
    var events = await Events.find({ })
    res.send({ isSuccess: true , events :events});
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
    var events = await Events.find({ });
    var scheduleBatches = await ScheduleBatches.find({ });
    res.send({ isSuccess: true , events :events , scheduleBatches : scheduleBatches});
  } catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})

app.post('/schedule-event', async (req, res) => {
 // console.log('req.body',req.body);
 try{ const {
    active,
    eventId,
    batches,
  } = req.body;
  console.log('batches',batches)
  const scheduleBatches = new ScheduleBatches({
    active : active,
    eventId : eventId,
    batches : batches
  });

  scheduleBatches.save();
  res.send({ isSuccess: true}); 
} catch (error) {
    console.error(error);
    res.send({ isSuccess: false, error: error });
  }
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

