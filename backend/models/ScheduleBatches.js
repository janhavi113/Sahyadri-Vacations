import mongoose from "mongoose";

const scheduleBatchesSchema = new mongoose.Schema({
    active: { type: Boolean},
    eventId: { type :Number},
    batches: [ { eventCostPerPerson : { type :Number},
        eventEndDate  :{type: Date  },
        eventStartDate  :{type: Date }
        }
     ]
});


export const ScheduleBatches = mongoose.model('ScheduleBatches', scheduleBatchesSchema);