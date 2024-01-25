import { Request, Response } from "express";
import Task from "../../models/task";
import Category from "../../models/category";
import asyncWrapper from "../../middleware/asyncWrapper";

export const getCategoryTasks = asyncWrapper(
	async (req: Request, res: Response): Promise<void> => {
		const { categoryId } = req.params;

		const categoryTasks = await Task.find({ categories: { $in: categoryId } });
		const category = await Category.findById(categoryId);

		res.json({ tasks: categoryTasks, category });
	}
);
