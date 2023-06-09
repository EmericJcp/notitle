import express from "express";
import { getBooks } from "../controllers/googleBooksController";

const router = express.Router();

router.get("/", getBooks);

export { router as googleBooksRoutes };
