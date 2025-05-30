import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/ai.route.js";
import connectMongodb from "./connection.js";
import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js";
import noteRoutes from './routes/note.route.js';
import chatRoutes from './routes/chat.route.js';
import preAssessmentRoutes from './routes/preassement.route.js';
import knowledgeBaseRoutes from './routes/knowledgeBase.route.js';



dotenv.config();
const PORT=process.env.PORT || 5000;
const MONGO_URI=process.env.MONGO_URI;
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [process.env.CORS_ORIGIN ,'http://localhost:5173', 'http://127.0.0.1'];
        if (allowedOrigins.includes(origin) || !origin) {
            // Allow no origin (when the request is made by the server itself, for example)
            callback(null, true);
        } else {
            callback(new Error('CORS policy does not allow this origin.'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // This is important to allow credentials
    optionsSuccessStatus: 204, // For legacy browsers
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

app.use('/auth',authRoutes);
app.use("/ai", aiRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/assessment', preAssessmentRoutes);
app.use('/api/kb', knowledgeBaseRoutes);
app.get("/",(req, res) => {res.status(200).json({"message":"backend working"});});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
connectMongodb(MONGO_URI);
