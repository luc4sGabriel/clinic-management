import express from 'express';
import cors from 'cors';
import { router } from './infra/http/routes/routes.js';
import { errorHandler } from './middleware/error-handler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);
app.use(errorHandler);

export { app };