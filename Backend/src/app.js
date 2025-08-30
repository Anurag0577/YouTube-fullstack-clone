import express from "express";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import videoRoutes from "./routes/videoRoutes.js"
import cors from 'cors';
import connectDB from "./db/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import engagementRoutes from './routes/engagementRoutes.js'
import commentRoutes from './routes/commentRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import channelRoutes from './routes/channelRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    console.log('Welcome to the Youtube clone!')
    res.send('Welcome to the YouTube Clone.')
})
app.use('/api/file', uploadRoutes);
app.use('/api/auth', authRoutes );
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/engagement', engagementRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/channel', channelRoutes)
app.use('/api/subscription', subscriptionRoutes)
// Move error handler to the end
app.use(errorHandler)


connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started successfully! Running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed! ", error);
})