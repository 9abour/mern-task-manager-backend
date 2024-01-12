import { Request, Response } from "express";
import { ITask } from "../../types/task.types";
import Task from "../../models/task";
import { verifyToken } from "../../helper/verifyToken";
import Category from "../../models/category";

export const addTask = async (req: Request, res: Response): Promise<void> => {
	try {
		const dataPayload = req.body;

		const token = req.headers.authorization;

		if (!token || !verifyToken(token)) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthorized!",
					},
				],
			});
			return;
		}

		const { name, description, categories, xp } = dataPayload;

		const task = await Task.findOne({ name, description }).exec();

		const category = await Category.findOne({ _id: categories[0] });

		if (!category) {
			res.status(404).json({
				errors: [
					{
						msg: "There is no category to assigned this task to it.",
					},
				],
			});
			return;
		}

		const duplicatedCategory = task?.categories.includes(categories);

		if (duplicatedCategory && task) {
			res.status(409).json({
				errors: [
					{
						msg: "The task already exists!",
					},
				],
			});
			return;
		} else if (task && !duplicatedCategory) {
			await Task.updateOne(
				{ name, description },
				{
					$push: { categories: categories[0] },
				}
			);

			res.json({
				msg: "The task has been assigned to this category.",
				task,
			});
			return;
		}

		const newTask: ITask = await new Task({
			name,
			description,
			xp,
			isCompleted: false,
			categories,
		}).save();

		res.status(201).json({
			msg: "The task has been added.",
			task: newTask,
		});
		return;
	} catch (error) {
		throw error;
	}
};
