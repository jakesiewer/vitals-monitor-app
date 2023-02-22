import express from 'express';
import { getActivities, getActivityStream } from '../controllers/stravaActivityController.js';

const router = express.Router();

router.get('/activities', getActivities);
router.get('/activity-stream', getActivityStream);

export default router;