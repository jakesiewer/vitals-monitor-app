import express from 'express';

import { getFitbitActivities, getFibitActivityStream } from '../controllers/fitbitActivityController.js';

const router = express.Router();

router.get('/fitbit-activities', getFitbitActivities);
router.get('/fitbit-activity-data', getFibitActivityStream);

export default router;