import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { filterUserXP } from "../../helper/filterUserXP";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

export const getTotalUserXP = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (!user) {
			const error = new AppError({
				code: 404,
				message: "User not found!",
			});
			return next(error);
		}

		const { completedTasks } = user;
		const totalUserXP = await filterUserXP(completedTasks);

		res.json({ totalUserXP });
	}
);
