import { Request, Response } from "express";
import { filterCategoryTasksCount } from "../../helper/filterCategoryTasksCount";
import asyncWrapper from "../../middleware/asyncWrapper";

export const getCategoryTasksCount = asyncWrapper(
	async (req: Request, res: Response) => {
		const { categoryId } = req.params;

		const { tasksCount, completedCount, tasksXP } =
			await filterCategoryTasksCount(categoryId);

		res.json({
			tasksCount,
			completedCount,
			tasksXP,
		});
	}
);
