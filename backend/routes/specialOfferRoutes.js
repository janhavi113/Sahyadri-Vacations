import express from 'express';
import SpecialOffer from '../models/SpecialOffer.js';
import Coupon from '../models/Coupon.js';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Get all special offers (populate events)
router.get('/special-event', async (req, res) => {
  try {
    const offers = await SpecialOffer.find().populate('events');
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all special offers (populate events)
router.get('/special-offer', async (req, res) => {
  
  try {
    const coupons = await Coupon.find({eventType : 'Special'});
    console.log('coupons--',coupons);
    res.status(200).json({ message: 'Special offer saved successfully', coupons:coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add or update a special offer
router.post('/create-special-event', async (req, res) => {

  try {
    var currUrl = "";
		let sampleFile = req.files.images;
		let uploadPath = path.join(__dirname, '../../public/Images', sampleFile.name);
		currUrl = 'public/Images/' + sampleFile.name;
		sampleFile.mv(uploadPath, (err) => {
			if (err) {
				return res.status(500).send(err);
			}
		});
    const {
			title,
      events
		} = req.body;
    let eventList = JSON.parse(events);
    let eventIdList = [];
    for(let i = 0; i < eventList.length ; i++){
      eventIdList.push(eventList[i].value.toString());     
    }
    console.log('eventIdList--',eventIdList);
      const offer = new SpecialOffer({
        imagePath: currUrl, 
        events :eventIdList,
        title: title
      });
      console.log('offer--',offer);
      await offer.save();
    
    res.status(200).json({ message: 'Special offer saved successfully', offer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;