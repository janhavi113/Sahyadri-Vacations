import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name:  { type :String},
    apiname:  { type :String},
    itinerary:  { type :String},
    eventDetails:  { type :String},
    costIncludes:  { type :String},
    thingsToCarry:  { type :String},
    pickupPoints:  { type :String},
    highlights:  { type :String},
    url: { type :String},
    eventId: { type :Number},
    images: [{
        type: String
    }]
});


export const Events = mongoose.model('Events', eventSchema);