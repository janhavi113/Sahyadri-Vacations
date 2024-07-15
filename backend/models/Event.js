import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name:  { type :String},
    eventType: { type :String},
    apiname:  { type :String , unique : true, dropDups: true},
    itinerary:  { type :String},
    eventDetails:  { type :String},
    costIncludes:  { type :String},
    thingsToCarry:  { type :String},
    pickupPoints:  { type :String},
    highlights:  { type :String},
    url: { type :String},
    eventId: { type :Number},
    location: { type :String},
    images: [{
        type: String
    }]
});


export const Events = mongoose.model('Events', eventSchema);