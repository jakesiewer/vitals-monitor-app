import express from "express";

import { insertJournal, getNearestJournal, getAllJournals, getJournalId, getJournalTimestamp } from "../controllers/journalControllers.js";

const router = express.Router();

router.post("/insert", insertJournal);
router.get("/nearest", getNearestJournal);
router.get("/all", getAllJournals);
router.get("id/:journalId", getJournalId);
router.get("timestamp/:timestamp", getJournalTimestamp);


export default router;