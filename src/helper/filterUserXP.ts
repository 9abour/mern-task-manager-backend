import Tasks from "../models/task";
import { ITask } from "../types/task.types";

/**
 * Filters the user's XP based on the completed tasks.
 *
 * @param {string[]} completedTasks - An array of task IDs representing the completed tasks.
 * @return {Promise<number>} The total XP earned from the completed tasks.
 */

export const filterUserXP = async (
	completedTasks: string[]
): Promise<number> => {
	const tasks = await Tasks.find({ _id: { $in: completedTasks } });

	if (!tasks.length) return 0;

	const totalXP = tasks.reduce((acc, curr: ITask) => acc + curr.xp, 0);

	return totalXP;
};
