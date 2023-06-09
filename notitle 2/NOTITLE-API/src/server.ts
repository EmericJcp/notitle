import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { googleBooksRoutes } from "./routes/googleBooksRoutes";
import { gptRoutes } from "./routes/gptRoutes";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use("/books", googleBooksRoutes);
app.use("/gptBooks", gptRoutes);

app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
