import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cors from 'cors';
import connectDB from "./db/index.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    console.log('Welcome to the Youtube clone!')
    res.send('Welcome to the YouTube Clone.')
})
app.use('/file', uploadRoutes);
app.use('/auth', authRoutes );


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started successfully! Running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed! ", error);
})