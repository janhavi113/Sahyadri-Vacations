import mongoose from "mongoose";
// const batchesSchema = new mongoose.Schema({ 
//         eventCostPerPerson : { type :Number},
//         eventEndDate  :{type: Date  },
//         eventStartDate  :{type: Date },
//         eventBatchCount : { type :Number},
//         everyWeekend: { type: Boolean}, 
//         notScheduleYet: { type: Boolean},        
//         });

const scheduleBatchesSchema = new mongoose.Schema({
    active: { type: Boolean},
    wishlist: { type: Boolean},
    eventname:{ type :String},
    eventId: { type :Number},
    eventApi:{ type :String},
    Url: { type :String},    
    eventType: { type :String},
    eventCostPerPerson : { type :Number},
    b2bPrice: { type :Number},
    bookingTillDate:{type: String },
    bookingTillTime:{type: String },
    eventEndDate  :{type: Date  },
    eventStartDate  :{type: Date },
    eventBatchCount : { type :Number},
    everyWeekend: { type: Boolean}, 
    notScheduleYet: { type: Boolean},
    images:{type: String }
});


export const ScheduleBatches = mongoose.model('ScheduleBatches', scheduleBatchesSchema);