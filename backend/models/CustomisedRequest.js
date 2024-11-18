import mongoose from "mongoose";
import _autoIncrement from "mongoose-sequence"; // Corrected import with aliasing

// Initialize autoIncrement with mongoose instance
const autoIncrement = _autoIncrement(mongoose);

const customisedRequestSchema = new mongoose.Schema({
    name: { type: String },
    phone: { type: Number },
    traveldate: { type: Date },
    durationoftour: { type: String },
    numberofpeople: { type: Number },
    email: { type: String },
    message: { type: String },
    inquireydate: { 
        type: Date, 
        default: Date.now // Sets the default value to the current date
    },
    status: { 
        type: String,
        enum: ['new', 'In process', 'Cancel', 'Hold', 'Complete'], // Allowed values
        default: 'new' // Default value
    },
    leadId: { 
        type: Number, 
        unique: true // Ensures uniqueness
    },
    itinerary:  { type :String},
    packageProvided:  { type :String},
    finalPackage:  { type :String},
});

// Apply the auto-increment plugin to the schema
customisedRequestSchema.plugin(autoIncrement, { inc_field: 'leadId' });

export const CustomisedRequest = mongoose.model('CustomisedRequest', customisedRequestSchema);
