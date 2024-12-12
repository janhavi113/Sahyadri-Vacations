import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name:  { type :String},
    eventType: { type :String},
    apiname:  { type :String , unique : true, dropDups: true},
    itinerary:  { type :String},
    eventDetails:  { type :String},
    costIncludes:  { type :String},
    costExcludes:  { type :String},
    FAQ:  { type :String},
    thingsToCarry:  { type :String},
    pickupPoints:  { type :String},
    pickupPointsfromMumbai:  { type :String},
    b2bLocaion: { type :String},
    highlights:  { type :String},
    url: { type :String},
    eventId: { type :Number},
    location: { type :String},
    type: { type :String},
    elevation: { type :String},
    difficulty: { type :String},
    endurance: { type :String},
    duration: { type :String},
    totalDistance: { type :String},
    ageGroup: { type :String},
    trekDistance: { type :String},
    images: [{
        type: String
    }]
});


export const Events = mongoose.model('Events', eventSchema);