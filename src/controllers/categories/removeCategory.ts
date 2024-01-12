import { Request, Response } from "express";
import { verifyToken } from "../../helper/verifyToken";
import Category from "../../models/category";
import Task from "../../models/task";
import User from "../../models/user";

export const removeCategory = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const token = req.headers.authorization;
		const { categoryId } = req.params;

		if (!token) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthorized!",
					},
				],
			});
			return;
		}

		if (!categoryId) {
			res.status(401).json({
				errors: [
					{
						msg: "The category id is missing!",
					},
				],
			});
			return;
		}

		const user = verifyToken(token);

		if (!user) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthorized!",
					},
				],
			});
			return;
		}

		await Category.deleteOne({ _id: categoryId });

		await User.updateOne(
			{ email: user.email },
			{
				$pull: { completedTasks: categoryId },
			}
		);

		const categoryTasks = await Task.find({ categories: categoryId });

		categoryTasks.map(async task => {
			const taskId = task._id;
			if (task.categories.length > 1) {
				await Task.updateOne(
					{ _id: taskId },
					{
						$pull: { categories: categoryId },
					}
				);
			} else {
				await Task.deleteOne({ _id: taskId });
			}
		});

		res.json({
			msg: "The category has been deleted.",
		});
	} catch (error) {
		throw error;
	}
};
