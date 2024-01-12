import { Request, Response } from "express";
import Task from "../../models/task";
import { ITask } from "../../types/task.types";

export const getTask = async (req: Request, res: Response) => {
	try {
		const { taskId } = req.params;
		const task: ITask | null = await Task.findById(taskId);

		res.status(200).json(task);
	} catch (error) {
		res.status(404).json({
			msg: "The task not found!",
		});
		throw error;
	}
};
