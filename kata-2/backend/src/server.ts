import 'dotenv/config';
import { app } from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  🚀 Server Running
  📡 URL: http://localhost:${PORT}
  🛠️  Ambiente: Development
  📦 Banco: PostgreSQL via Docker
  `);
});