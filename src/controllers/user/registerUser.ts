import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import bcrypt from "bcrypt";
import AppError from "../../helper/appError";
import asyncWrapper from "../../middleware/asyncWrapper";

/**
 * Registers a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves to void.
 */

export const registerUser = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const { name, email, password } = req.body;

		const user = await User.findOne({ email }).exec();

		if (user) {
			const error = new AppError({
				code: 404,
				message: "The user already exists!",
			});
			next(error);
			return;
		}

		const newUser = new User({
			name,
			email,
			password,
		});

		bcrypt.genSalt(10, (error, salt) => {
			if (error) throw error;

			bcrypt.hash(password, salt, (error, hashed) => {
				if (error) throw error;

				newUser.password = hashed;

				newUser.save();
				res.status(201).json({
					message: "The user has been created.",
				});
			});
		});
	}
);
