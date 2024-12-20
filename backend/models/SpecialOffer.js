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
    required: true
  },
  starts_with: { type: String },
  active: { type: Boolean, default: true },
});

const SpecialOffer = mongoose.model('SpecialOffer', SpecialOfferSchema);
export default SpecialOffer;
