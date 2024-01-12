import express from "express";
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

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
