import mongoose from "mongoose";

const scheduleBatchesSchema = new mongoose.Schema({
  active: { type: Boolean, default: true },
  wishlist: { type: Boolean },
  eventname: { type: String },
  eventId: { type: Number },
  eventApi: { type: String },
  Url: { type: String },
  eventType: { type: String },
  eventCostPerPerson: { type: Number },
  b2bPrice: { type: Number },
  bookingTillDate: { type: String },  // format: YYYY-MM-DD
  bookingTillTime: { type: String },  // format: HH:mm
  eventEndDate: { type: Date },
  eventStartDate: { type: Date },
  eventBatchCount: { type: Number },
  everyWeekend: { type: Boolean },
  notScheduleYet: { type: Boolean },
  images: { type: String },
  scheduleEventId: { type: String },
  alreadyBoockedCount: { type: Number , default: 0},
  specialOfferEvent: { type: Boolean , default: false },
  partialBookingAmount : { type: Number },
});

// Middleware to check and update `active` field before each query
scheduleBatchesSchema.pre(['find', 'findOne', 'findById'], async function (next) {
  const currentDate = new Date();
  
  // Get the current date and time in the appropriate format for comparison
  const currentDateStr = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTimeStr = currentDate.toTimeString().split(' ')[0].substring(0, 5); // HH:mm
  
  // Step 1: Update active status for events based on bookingTillDate and bookingTillTime
  await ScheduleBatches.updateMany(
    {
      active: true,  // Ensure the event is active initially
      everyWeekend: false,  // Ensure the event is not marked for every weekend
      notScheduleYet: false,  // Ensure the event is scheduled
      $or: [
        // If the bookingTillDate is less than current date, set active to false
        { bookingTillDate: { $lt: currentDateStr } },
        
        // If the bookingTillDate is today but the bookingTillTime is earlier than current time, set active to false
        {
          $and: [
            { bookingTillDate: currentDateStr },
            { bookingTillTime: { $lt: currentTimeStr } }
          ]
        }
      ]
    },
    { active: false }  // Set active to false for expired events
  );

  // Step 2: Delete events where bookingTillDate has passed and active is false
  await ScheduleBatches.deleteMany(
    {
      active: false,  // Ensure the event is inactive
      bookingTillDate: { $lt: currentDateStr }  // If bookingTillDate is in the past
    }
  );

  next();
});

export const ScheduleBatches = mongoose.model('ScheduleBatches', scheduleBatchesSchema);
