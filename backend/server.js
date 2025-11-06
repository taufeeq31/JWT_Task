import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'OK' });
});

const port = process.env.PORT || 5001;
app.listen(port);
