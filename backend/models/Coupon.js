// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: [true, 'Coupon name is required'],
  },
  discountPrice: {
    type: Number,
    validate: {
      validator: function (value) {
        // Either discountPrice or discountPercent must be provided
        return value != null || this.discountPercent != null;
      },
      message: 'Either discount price or discount percent must be provided',
    },
  },
  discountPercent: {
    type: Number,
    validate: {
      validator: function (value) {
        // Either discountPrice or discountPercent must be provided
        return value != null || this.discountPrice != null;
      },
      message: 'Either discount price or discount percent must be provided',
    },
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['TrekEvent', 'CampingEvent', 'BackPackingTrip','AdventureActivity', 'Special'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
