import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
const app = express();

app.use('/file', uploadRoutes)