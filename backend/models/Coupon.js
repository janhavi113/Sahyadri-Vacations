// models/Coupon.js
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  couponName: {
    type: String,
    required: [true, 'Coupon name is required'],
  },
  couponDescription: {
    type: String,
    required: [true, 'Description is required'],
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
  numberOfPeople: {
    type: Number,
    required: [true, 'Number of people is required'], // Make it optional by removing this line
    min: [0, 'Number of people must be at least 0'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
