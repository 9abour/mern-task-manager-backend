import { NextFunction, Request, Response } from "express";
import Category from "../../models/category";
import Task from "../../models/task";
import User from "../../models/user";
import AppError from "../../helper/appError";
import asyncWrapper from "../../middleware/asyncWrapper";
import { IVerifyTokenRequest } from "../../types/express.types";

export const removeCategory = asyncWrapper(
	async (
		req: IVerifyTokenRequest,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		const token: string | undefined = req.headers.authorization;
		const { categoryId } = req.params;

		const { user } = req;

		if (!user) {
			const error = new AppError({
				code: 401,
				message: "Unauthorized!",
			});
			return next(error);
		}

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
