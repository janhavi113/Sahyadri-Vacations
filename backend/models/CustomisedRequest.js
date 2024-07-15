import mongoose from "mongoose";

const customisedRequestSchema = new mongoose.Schema({
    name: { type :String},
    phone: { type :Number},
    traveldate: { type :Date},
    durationoftour: { type :String},
    numberofpeople: { type :Number},
    email: { type :String},
    message: { type :String},
    status: { type :String},
});


export const CustomisedRequest = mongoose.model('CustomisedRequest', customisedRequestSchema);