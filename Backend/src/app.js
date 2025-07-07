import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/uploadRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
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
app.use('/api/file', uploadRoutes);
app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes)
app.use('/api/videos', videoRoutes)


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started successfully! Running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed! ", error);
})