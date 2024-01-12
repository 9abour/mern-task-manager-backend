import User from "../../models/user";
import { ITask } from "../../types/task.types";
import { IUser } from "../../types/user.types";

export const toggleUserCompletedTask = async (task: ITask, user: IUser) => {
	if (task.isCompleted) {
		await User.updateOne(
			{ email: user.email },
			{
				$pull: { completedTasks: task._id },
			}
		);
	} else {
		await User.updateOne(
			{ email: user.email },
			{
				$push: { completedTasks: task._id },
			}
		);
	}
};
