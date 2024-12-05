import mongoose from 'mongoose';

const SpecialOfferSchema = new mongoose.Schema({
  imagePath: { type: String, required: true },
  title: { type: String, required: true },
  events:  [{
    type: String
}],
  couponId:{ type: String },
  date: { 
    type: Date, 
    required: true, 
    default: Date.now // Set default to the current date and time
  }
});

const SpecialOffer = mongoose.model('SpecialOffer', SpecialOfferSchema);
export default SpecialOffer;
