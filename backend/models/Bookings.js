import mongoose from "mongoose";
const otherParticipantsSchema = new mongoose.Schema({
    name: { type: String },
    mobileNumber: { type: Number },
    pickupLocation: { type: String },
    status: { type: String }
});

const bookingsSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    mobileNumber: { type: Number },
    batch: { type: String },
    eventId: { type: Number },
    eventName: { type: String },
    numberOfPeoples: { type: Number, default: 1 },
    amountPaid: { type: Number, default: 0 },
    remainingAmount: { type: Number, default: 0 },
    packageGiven: { type: Number, default: 0 },
    pickupLocation: { type: String },
    status: { type: String },
    bookingDate: { type: String },
    bookingId: { type: String },
    eventPrice: { type: String },
    addedDiscount: { type: String },
    paymentMethod: { type: String },
    bookingMode: { type: String, default: 'Website' },
    transactionId: { type: String },
    scheduleEventId: { type: String },
    eventStartDate: { type: Date },
    eventEndDate: { type: Date },
    invoiceDelivered: { type: Boolean, default: false },
    addedOn: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    doubleSharing: { type: Number, default: 0 },
    tripalSharing: { type: Number, default: 0 },
    thirdAcUpgrate: { type: Number, default: 0 },
    otherParticipants: [otherParticipantsSchema
    ]
}, { strict: false });

export const Bookings = mongoose.model('bookings', bookingsSchema);

