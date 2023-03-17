import express from "express";

import { insertJournal, getJournal, getJournalId, getJournalTimestamp } from "../controllers/journalControllers.js";

const router = express.Router();

router.post("/insert", insertJournal);
router.get("/", getJournal);
router.get("id/:journalId", getJournalId);
router.get("timestamp/:timestamp", getJournalTimestamp);


export default router;