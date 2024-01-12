import mongoose from "mongoose";

export const connectToMongoDB = async () => {
	const uri = process.env.MONGODB_URI || "";
	try {
		await mongoose.connect(uri);
		console.log("connected to the database");
	} catch (error) {
		console.error("MongoDB connection error:", (error as Error).message);
	}
};
