import mongoose from "mongoose";
const otherParticipantsSchema = new mongoose.Schema({ 
    name:  { type :String},
    mobileNumber:  { type :String},
    pickupLocation: { type :String}
    });
const directBookingsSchema = new mongoose.Schema({
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
    bookingDate: { type :String},
    images:{type: String },
    otherParticipants: [ otherParticipantsSchema
    ]
});

export const DirectBookings = mongoose.model('directBookings', directBookingsSchema);

