import { NextFunction, Request, Response } from "express";
import { getUserInfo } from "../../helper/getUserInfo";
import Category from "../../models/category";
import Task from "../../models/task";
import User from "../../models/user";
import AppError from "../../helper/appError";
import { IUser } from "../../types/user.types";
import asyncWrapper from "../../middleware/asyncWrapper";

export const removeCategory = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const token: string | undefined = req.headers.authorization;
		const { categoryId } = req.params;

		if (!token) {
			const error = new AppError({
				code: 409,
				message: "Unauthorized!",
			});
			return next(error);
		}

		if (!categoryId) {
			const error = new AppError({
				code: 401,
				message: "The category id is missing!",
			});
			return next(error);
		}

		const user: IUser = getUserInfo(token);

		if (!user) {
			const error = new AppError({ code: 401, message: "Unauthorized!" });
			return next(error);
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
			message: "The category has been deleted.",
		});
	}
);
