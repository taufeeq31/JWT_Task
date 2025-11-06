import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './src/config/db.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import taskRoutes from './src/routes/task.routes.js';

dotenv.config();

connectDB();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

const port = process.env.PORT || 5001;
app.listen(port);

// 404 handler for unmatched routes
app.use((req, res, next) => {
    return res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
    res.status(500).json({ message: 'Server error' });
});

