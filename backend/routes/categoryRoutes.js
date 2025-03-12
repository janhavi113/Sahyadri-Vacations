import express from 'express';
import { MainCategoriesSection } from '../models/MainCategoriesSection.js';
import { ScheduleBatches } from '../models/ScheduleBatches.js';

const router = express.Router();

router.get("/show-all-category-events/:categoryId", async (req, res) => {
    try {
        console.log('req.params.categoryId--', req.params.categoryId);

        let category = await MainCategoriesSection.find({ categoryId: req.params.categoryId });
        
        if (!category.length) {
            return res.status(404).send({
                isSuccess: false,
                message: "Category not found"
            });
        }

        let eventIds = category[0].events;
        const eventIdList = eventIds[0].split(',').map(Number);

        // Await the query to get actual data
        let eventList = await ScheduleBatches.find({ eventId: { $in: eventIdList } });

        res.send({
            isSuccess: true,
            category: category[0],
            events: eventList
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            isSuccess: false,
            error: error.message
        });
    }
});

export default router;
