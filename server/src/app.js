import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.routes.js';

const app = express();

// CORS - CLIENT_URL có thể chứa nhiều origin, cách nhau bằng dấu phẩy
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:5174')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API kiểm tra server
app.use('/api', apiRouter);

export default app;