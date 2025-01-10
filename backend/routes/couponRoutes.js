// routes/couponRoutes.js
import express from 'express';
import Coupon from '../models/Coupon.js';

const router = express.Router();

// Route to create a new coupon
router.post('/create-coupon', async (req, res) => {
  const { couponName, discountPrice, discountPercent, eventType, numberOfPeople, couponDescription } = req.body;

  // Check if either discountPrice or discountPercent is provided
  if (!couponName || !eventType || (!discountPrice && !discountPercent) || !numberOfPeople) {
    return res.status(400).json({ message: 'Coupon name, event type, and either discount price or discount percent are required' });
  }

  try {
    // Create a new coupon instance
    const newCoupon = new Coupon({
      couponName,
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      discountPercent: discountPercent ? parseFloat(discountPercent) : null,
      eventType,
      numberOfPeople,
      couponDescription
    });

    // Save the new coupon to the database
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created successfully', coupon: newCoupon });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }
});
router.post('/api/validate-coupon', async (req, res) => {
  const { code, eventType, numberOfPeople } = req.body;
 
  try {
    const newCoupon = await Coupon.findOne({ couponName: code });
    console.log('numberOfPeople----', typeof numberOfPeople);
    console.log('newCoupon.numberOfPeople----', typeof newCoupon.numberOfPeople);
    if ((numberOfPeople >= newCoupon.numberOfPeople) &&  (eventType == newCoupon.eventType || newCoupon.eventType == 'Special' )) {

      res.status(201).json({ message: 'Coupon Applied', isValid: true, coupon: newCoupon });
    } else {
      res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon', error: error.message });
  }

});
router.get('/get-coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find(); // Fetch all coupons from the database
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons', error: error.message });
  }
});
router.get('/get-coupons-event/:eventType', async (req, res) => {
  try {
    console.log('#req.params--',req.params.eventType);
    const coupons = await Coupon.find({eventType: req.params.eventType}); // Fetch all coupons from the database
    coupons.sort((a, b) => a.numberOfPeople - b.numberOfPeople);
    res.status(200).json({ success: true, coupons:coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching coupons', error: error.message });
  }
});
router.delete('/delete-coupon/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCoupon = await Coupon.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting coupon', error: error.message });
  }
});
export default router;
