import task from "../models/task";
import { ITask } from "../types/task.types";

export const filterCategoryTasksCount = async (categoryId: string) => {
	const categoryTasks: ITask[] = await task.find({
		categories: { $in: categoryId },
	});

	const tasksCount = categoryTasks.length;
	let completedCount = 0;
	let tasksXP = 0;

	categoryTasks.map(task => {
		if (task.isCompleted) {
			completedCount++;
			tasksXP += task.xp;
		}
	});

	return {
		tasksCount,
		completedCount,
		tasksXP,
	};
};
