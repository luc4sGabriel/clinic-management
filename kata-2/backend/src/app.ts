import express from 'express';
import cors from 'cors';
import { router } from './infra/http/routes/routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export { app };