import mongoose from "mongoose";
const otherParticipantsSchema = new mongoose.Schema({ 
    name:  { type :String},
    mobileNumber:  { type :Number},
    pickupLocation: { type :String},
    status: { type :String}   
    });

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
    bookingDate:  { type :String},
    bookingId:  { type :String},
    eventPrice:  { type :String},
    addedDiscount: { type :String},
    paymentType: { type :String},
    transactionId: { type :String},
    otherParticipants: [ otherParticipantsSchema
    ]
});

export const Bookings = mongoose.model('bookings', bookingsSchema);

