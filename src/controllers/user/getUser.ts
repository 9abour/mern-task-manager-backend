import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { getUserInfo } from "../../helper/getUserInfo";
import asyncWrapper from "../../middleware/asyncWrapper";
import AppError from "../../helper/appError";

/**
 * Retrieves user information based on the provided request.
 *
 * @param {Request} req - The request object containing the user token.
 * @param {Response} res - The response object used to send the user information.
 * @return {Promise<void>} - A promise that resolves when the user information has been sent or rejects if an error occurs.
 */

export const getUser = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const token = req.headers["authorization"];

		if (!token) {
			const error = new AppError({
				code: 404,
				message: "There is no token!",
			});
			return next(error);
		}

		const { email } = getUserInfo(token);

		const user = await User.findOne({ email });

		if (!user) {
			const error = new AppError({
				code: 401,
				message: "Unauthenticated!",
			});
			return next(error);
		}

		const { _id, name, completedTasks, xp } = user;

		res.json({
			_id,
			name,
			email: user.email,
			completedTasks,
			xp,
		});
	}
);
