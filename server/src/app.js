import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  }),
);
app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
