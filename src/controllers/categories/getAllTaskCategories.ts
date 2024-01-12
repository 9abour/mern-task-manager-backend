import { Request, Response } from "express";
import Task from "../../models/task";
import Category from "../../models/category";

export const getAllTaskCategories = async (
	req: Request,
	res: Response
): Promise<void> => {
	const { taskId } = req.params;

	const task = await Task.findOne({ _id: taskId });

	if (!task) {
		res.status(404).json({ error: "Task not found" });
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

	try {
	} catch (error) {
		res.status(500).json({
			errors: [
				{
					msg: "Internal Server Error",
				},
			],
		});

		throw error;
	}
};
