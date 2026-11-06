import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.routes.js';

const app = express();

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API kiểm tra server
app.use('/api', apiRouter);

export default app;