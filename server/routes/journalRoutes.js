import express from "express";

import { insertJournal, getJournal } from "../controllers/journalControllers.js";

const router = express.Router();

router.post("/insert", insertJournal);
router.get("/:journalId", getJournal);

export default router;