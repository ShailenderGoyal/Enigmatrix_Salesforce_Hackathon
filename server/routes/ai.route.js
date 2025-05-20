import express from "express"
const router=express.Router();
import { handleSummary,handleAiResponse } from "../controllers/ai.controller.js";
router.post("/summarize",handleSummary);
router.post("/res",handleAiResponse);

export default router