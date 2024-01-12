import { Request, Response } from "express";
import User from "../../models/user";
import Task from "../../models/task";
import { IUser } from "../../types/user.types";

export const getUserTasks = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params;

		const user: IUser | null = await User.findOne({ _id: userId });

		if (!user) {
			res.status(404).json({ error: "Task not found" });
			return;
		}

		const completedTasksIds = user.completedTasks;

		const tasks = await Promise.all(
			completedTasksIds.map(async taskId => {
				const task = await Task.findOne({ _id: taskId });
				return task;
			})
		);

		res.json({ tasks });
	} catch (error) {
		throw error;
	}
};
