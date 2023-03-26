import express from "express";
import { fitbitLogin, fitbitCallback } from "../controllers/fitbitAuthController.js"

const router = express.Router();

router.get("/fitbit-login", fitbitLogin);
router.get('/fitbit-callback', fitbitCallback);

export default router;