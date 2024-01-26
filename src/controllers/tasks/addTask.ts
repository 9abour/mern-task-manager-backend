import { NextFunction, Request, Response } from "express";
import { ITask } from "../../types/task.types";
import Task from "../../models/task";
import Category from "../../models/category";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

export const addTask = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const dataPayload = req.body;

		const { name, description, categories, xp } = dataPayload;

		const task = await Task.findOne({ name, description }).exec();

		const category = await Category.findOne({ _id: categories[0] });

		if (!category) {
			const error = new AppError({
				code: 409,
				message: "There is no category to assigned this task to it.",
			});
			return next(error);
		}

		const duplicatedCategory = task?.categories.includes(categories);

		if (duplicatedCategory && task) {
			const error = new AppError({
				code: 409,
				message: "The task already exists!",
			});
			return next(error);
		} else if (task && !duplicatedCategory) {
			await Task.updateOne(
				{ name, description },
				{
					$push: { categories: categories[0] },
				}
			);

			res.json({
				message: "The task has been assigned to this category.",
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
			message: "The task has been added.",
			task: newTask,
		});
	}
);
