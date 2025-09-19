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
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Cookie parser should be before CORS
app.use(cookieParser());

// Fixed CORS configuration for cookies
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // Your backend
    'http://127.0.0.1:5173',
    // Add your production domain here
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization',
    'Cookie' // Allow Cookie header
  ],
  credentials: true, // CRITICAL: Enable cookies/credentials
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Body parsing middleware
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.get('/', (req, res) => {
    console.log('Welcome to the Youtube clone!')
    res.send('Welcome to the YouTube Clone.')
})

app.use('/api/file', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/engagement', engagementRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/subscription', subscriptionRoutes);

// Error handler should be last
app.use(errorHandler);

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server started successfully! Running on port ${PORT}`)
    })
})
.catch((error) => {
    console.log("MongoDB connection failed! ", error);
});