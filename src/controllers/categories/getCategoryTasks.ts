import { Request, Response } from "express";
import Task from "../../models/task";
import Category from "../../models/category";

export const getCategoryTasks = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { categoryId } = req.params;

		const categoryTasks = await Task.find({ categories: { $in: categoryId } });
		const category = await Category.findById(categoryId);

		res.json({ tasks: categoryTasks, category });
	} catch (error) {
		throw error;
	}
};
