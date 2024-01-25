import { IUser } from "../../types/user.types";
import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AppError from "../../helper/appError";

/**
 * Sign in a user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */

const secretKey: string = process.env.JWT_SECRET_KEY || "";

export const signinUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { email, password } = req.body as Pick<IUser, "email" | "password">;

	const dataPayload = {
		email,
		password,
	};

	const user = await User.findOne({ email });

	if (!user) {
		const error = new AppError({
			code: 401,
			message: "Wrong email!",
		});
		next(error);
		return;
	}

	const passwordMatch = await bcrypt.compare(password, user.password);

	if (!passwordMatch) {
		const error = new AppError({
			code: 401,
			message: "Wrong password!",
		});
		next(error);
		return;
	}

	const token = jwt.sign(dataPayload, secretKey);

	res.json(token);
};
