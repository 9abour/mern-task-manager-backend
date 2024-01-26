import { NextFunction, Request, Response } from "express";
import Task from "../../models/task";
import User from "../../models/user";
import { toggleUserCompletedTask } from "../user/toggleUserCompletedTask";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";
import { getUserInfo } from "../../helper/getUserInfo";

export const toggleTask = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const token = req.headers.authorization;

		if (!token) {
			const error = new AppError({
				code: 404,
				message: "There is no token!",
			});
			return next(error);
		}

		const user = getUserInfo(token);

		if (!user) {
			const error = new AppError({ code: 401, message: "Unauthenticated!" });
			return next(error);
		}

		const { taskId } = req.params;

		const task = await Task.findOne({ _id: taskId });

		if (task) {
			if (task.isCompleted) {
				const taskOwner = await User.findOne({
					completedTasks: { $in: taskId },
				});

				if (taskOwner?.email !== user.email) {
					const error = new AppError({
						code: 403,
						message:
							"The task can only be unchecked by the owner who completed it.",
					});
					return next(error);
				}
			}

			await toggleUserCompletedTask(task, user);

			await Task.updateOne(
				{
					_id: taskId,
				},
				{ isCompleted: !task.isCompleted }
			);

			res.json({
				message: `The task is ${
					!task.isCompleted ? "finished." : "unfinished."
				}`,
			});
		}
	}
);
