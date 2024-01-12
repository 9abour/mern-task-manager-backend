import { Request, Response } from "express";
import { filterCategoryTasksCount } from "./filterCategoryTasksCount";

export const getCategoryTasksCount = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;

		const { tasksCount, completedCount, tasksXP } =
			await filterCategoryTasksCount(categoryId);

		res.json({
			tasksCount,
			completedCount,
			tasksXP,
		});
	} catch (error) {
		throw error;
	}
};
