import { Request, Response } from "express";
import { verifyToken } from "../../helper/verifyToken";
import Task from "../../models/task";
import User from "../../models/user";
import { ITask } from "../../types/task.types";

export const removeTask = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization;
		const { taskId, categoryId } = req.body;

		if (!token) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthorized!",
					},
				],
			});
			return;
		}

		if (!taskId) {
			res.status(401).json({
				errors: [
					{
						msg: "The task id is missing!",
					},
				],
			});
			return;
		}

		const user = verifyToken(token);

		if (!user) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthorized!",
					},
				],
			});
			return;
		}

		const task: ITask | null = await Task.findOne({ _id: taskId });

		if (task) {
			if (task.isCompleted) {
				const taskOwner = await User.findOne({
					completedTasks: { $in: taskId },
				});

				if (taskOwner && taskOwner.email !== user.email) {
					res.status(403).json({
						errors: [
							{
								msg: `The task can only be deleted by the owner who completed it.`,
							},
						],
					});
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
				msg: "The task has been deleted form this assigned category.",
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
			msg: "The task has been deleted.",
		});
	} catch (error) {
		throw error;
	}
};
