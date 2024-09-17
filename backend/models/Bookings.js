import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
    name:  { type :String},
    email : { type :String},
    mobileNumber:  { type :Number},
    batch:  { type :String},
    eventId: { type :Number},
    eventName:  { type :String},
    numberOfPeoples: { type :Number},
    amountPaid: { type :Number},
    pickupLocation: { type :String},
    status: { type :String},
    bookingDate:  { type :String}
});

export const Bookings = mongoose.model('bookings', bookingsSchema);

