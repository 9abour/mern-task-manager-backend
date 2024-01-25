import { Request, Response } from "express";
import Task from "../../models/task";
import asyncWrapper from "../../middleware/asyncWrapper";

export const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {
	const tasks = await Task.find();
	res.status(200).json(tasks);
});
