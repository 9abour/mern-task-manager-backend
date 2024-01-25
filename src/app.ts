import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import tasksRoutes from "./routes/index";
import { connectToMongoDB } from "./helper/connnectMongoDB";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "5000";

app.use(express.json());
app.use(cors());
app.use(tasksRoutes);

// Connect to the database
connectToMongoDB();

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	res.status(error.code || 500).json({
		errors: [error],
	});
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
