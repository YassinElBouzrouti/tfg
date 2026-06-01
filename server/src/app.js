import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import apiRoutes from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

const allowedOrigins = new Set(['http://localhost:5173']);

if (process.env.CLIENT_URL) {
  allowedOrigins.add(process.env.CLIENT_URL);
}
if (process.env.VERCEL_URL) {
  allowedOrigins.add(`https://${process.env.VERCEL_URL}`);
}
if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  allowedOrigins.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      callback(null, allowedOrigins.has(origin));
    },
  }),
);
app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
