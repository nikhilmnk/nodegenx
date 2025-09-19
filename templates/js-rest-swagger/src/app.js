import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { swaggerDocs } from "./swagger/swagger.js";

dotenv.config();
const app = express();
app.use(express.json());

connectDB();

// Swagger setup
swaggerDocs(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;