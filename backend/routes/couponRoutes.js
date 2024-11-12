// routes/couponRoutes.js
import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Route to create a new coupon
router.post('/create-coupon', async (req, res) => {
  const { couponName, discountPrice, discountPercent, eventType } = req.body;

  // Check if either discountPrice or discountPercent is provided
  if (!couponName || !eventType || (!discountPrice && !discountPercent)) {
    return res.status(400).json({ message: 'Coupon name, event type, and either discount price or discount percent are required' });
  }

  try {
    // Create a new coupon instance
    const newCoupon = new Coupon({
      couponName,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      discountPercent: discountPercent ? parseFloat(discountPercent) : null,
      eventType,
    });

    // Save the new coupon to the database
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
});
router.post('/api/validate-coupon', async (req, res) => {
  const { code,  eventType } = req.body;
  console.log('req.body----',req.body);
  try {
  const newCoupon = await Coupon.findOne({couponName : code, eventType:eventType});
  console.log('newCoupon----',newCoupon);
  res.status(201).json({ message: 'Coupon Applied',isValid : true, coupon: newCoupon });
} catch (error) {
  res.status(500).json({ message: 'Error creating coupon', error: error.message });
}

});
export default router;
