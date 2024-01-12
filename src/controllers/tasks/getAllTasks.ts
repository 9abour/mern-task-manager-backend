import { Request, Response } from "express";
import Task from "../../models/task";

export const getAllTasks = async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find();
		res.status(200).json(tasks);
	} catch (error) {
		throw error;
	}
};
