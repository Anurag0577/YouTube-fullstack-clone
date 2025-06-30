import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';

const app = express();

app.use(cors);
app.use(express.json())

app.use('/file', uploadRoutes);
app.use('/authentication', authRoutes );


export default app;