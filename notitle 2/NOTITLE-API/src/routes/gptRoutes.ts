import express from "express";
import { getBookFromSummary } from "../controllers/gptController";

const router = express.Router();

router.post("/summary", getBookFromSummary);

export { router as gptRoutes };
