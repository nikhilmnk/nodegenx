import express from 'express';
import dotenv from 'dotenv';
import exampleRoutes from './routes/example.routes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', exampleRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;