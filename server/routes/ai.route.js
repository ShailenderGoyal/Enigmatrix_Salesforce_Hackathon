import express from "express"
const router=express.Router();
import { handleSummary } from "../controllers/ai.controller.js";
router.post("/summarize",handleSummary);

export default router