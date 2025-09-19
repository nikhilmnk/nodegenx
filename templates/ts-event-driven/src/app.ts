import express from "express";
import dotenv from "dotenv";
import { logger } from "./middlewares/loggerMiddleware";
import { testController } from "./controllers/sampleController";
import "./config/db";

dotenv.config();
const app = express();
app.use(express.json());
app.use(logger);

app.get("/", testController);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;