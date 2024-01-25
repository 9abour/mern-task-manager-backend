import { NextFunction, Request, Response } from "express";
import Task from "../../models/task";
import Category from "../../models/category";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

export const getAllTaskCategories = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { taskId } = req.params;

		const task = await Task.findOne({ _id: taskId });

		if (!task) {
			const error = new AppError({
				code: 409,
				message: "Task not found.",
			});
			next(error);
			return;
		}

		const categoryIds = task.categories;

		const categories = await Promise.all(
			categoryIds.map(async categoryId => {
				const category = await Category.findOne({ _id: categoryId });
				return {
					_id: category?._id,
					name: category?.name,
				};
			})
		);

		res.json(categories);
	}
);
