import { Request, Response } from "express";
import Task from "../../models/task";
import User from "../../models/user";
import { verifyToken } from "../../helper/verifyToken";
import { toggleUserCompletedTask } from "../user/toggleUserCompletedTask";

export const toggleTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization;

		if (!token) {
			res.status(404).json({
				errors: [
					{
						msg: "There is no token!",
					},
				],
			});
			return;
		}

		const allowedUser = verifyToken(token);

		if (!allowedUser) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthenticated!",
					},
				],
			});
			return;
		}

		const { taskId } = req.params;

		const user = verifyToken(token);

		if (!user) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthenticated!",
					},
				],
			});
			return;
		}

		const task = await Task.findOne({ _id: taskId });

		if (task) {
			if (task.isCompleted) {
				const taskOwner = await User.findOne({
					completedTasks: { $in: taskId },
				});

				if (taskOwner?.email !== user.email) {
					res.status(403).json({
						errors: [
							{
								msg: `The task can only be unchecked by the owner who completed it.`,
							},
						],
					});
					return;
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
				msg: `The task is ${!task.isCompleted ? "finished." : "unfinished."}`,
			});
		}
	} catch (error) {
		throw error;
	}
};
