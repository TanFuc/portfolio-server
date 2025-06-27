import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './utils/db.js';
import route from './routes/route.js';
import errorHandler from './middleware/error.middleware.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Routes
route(app);

// Global Error
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server đang hoạt động tại: http://localhost:${PORT}`));
