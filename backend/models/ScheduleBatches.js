import mongoose from "mongoose";
const batchesSchema = new mongoose.Schema({ 
        eventCostPerPerson : { type :Number},
        eventEndDate  :{type: Date  },
        eventStartDate  :{type: Date },
        eventBatchCount : { type :Number}
        });
const scheduleBatchesSchema = new mongoose.Schema({
    active: { type: Boolean},
    wishlist: { type: Boolean},
    eventname:{ type :String},
    eventId: { type :Number},
    batches: [ batchesSchema
     ],
     images:{type: String }
});


export const ScheduleBatches = mongoose.model('ScheduleBatches', scheduleBatchesSchema);