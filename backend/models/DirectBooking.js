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
    remainingAmount: { type :Number ,default: 0},
    packageGiven: { type :Number ,default: 0},
    pickupLocation: { type :String},
    status: { type :String},
    bookingDate: { type :String},
    images:{type: String },
    otherParticipants: [ otherParticipantsSchema
    ],
    paymentMethod: { type :String},
    bookingMode: { type :String , default:'Website'},
    transactionId: { type :String},
    eventStartDate: { type: Date },
    eventEndDate: { type: Date },
    eventPrice:  { type :String},
    addedDiscount: { type :String},
});

export const DirectBookings = mongoose.model('directBookings', directBookingsSchema);

