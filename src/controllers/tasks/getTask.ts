import { NextFunction, Request, Response } from "express";
import Task from "../../models/task";
import { ITask } from "../../types/task.types";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

export const getTask = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction) => {
		const { taskId } = req.params;
		const task: ITask | null = await Task.findById(taskId);

		if (!task) {
			const error = new AppError({
				code: 404,
				message: "The task not found!",
			});
			next(error);
			return;
		}

		res.status(200).json(task);
	}
);
