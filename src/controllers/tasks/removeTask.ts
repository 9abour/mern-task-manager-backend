import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../helper/verifyToken";
import Task from "../../models/task";
import User from "../../models/user";
import { ITask } from "../../types/task.types";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

export const removeTask = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const token = req.headers.authorization;
		const { taskId, categoryId } = req.body;
		const task: ITask | null = await Task.findOne({ _id: taskId });

		if (!token) {
			const error = new AppError({
				code: 401,
				message: "Unauthorized!",
			});
			next(error);
			return;
		} else if (!taskId) {
			const error = new AppError({
				code: 400,
				message: "The task id is missing!",
			});
			next(error);
			return;
		}

		const user = verifyToken(token);
		if (!user) {
			const error = new AppError({
				code: 401,
				message: "Unauthorized!",
			});
			next(error);
			return;
		}

		if (task) {
			if (task.isCompleted) {
				const taskOwner = await User.findOne({
					completedTasks: { $in: taskId },
				});

				if (taskOwner && taskOwner.email !== user.email) {
					const error = new AppError({
						code: 403,
						message:
							"The task can only be deleted by the owner who completed it.",
					});
					next(error);
					return;
				}
			}
		}

		// Check if there more then one category related
		if (task && task.categories.length > 1) {
			await Task.updateOne(
				{ _id: taskId },
				{
					$pull: { categories: categoryId },
				}
			);

			res.json({
				message: "The task has been deleted form this assigned category.",
			});

			return;
		}

		await Task.deleteOne({ _id: taskId });

		await User.updateOne(
			{ email: user.email },
			{
				$pull: { completedTasks: taskId },
			}
		);

		res.json({
			message: "The task has been deleted.",
		});
	}
);
