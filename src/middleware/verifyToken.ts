import jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import AppError from "../helper/appError";

/**
 * Verifies a token and returns the decoded user information.
 *
 * @param {string} token - The token to be verified.
 * @return {IUser} The decoded user information.
 */

export const verifyToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authPayload = req.headers.authorization;

	if (!authPayload) {
		const error = new AppError({
			code: 401,
			message: "The token is required!",
		});
		return next(error);
	}

	try {
		const secretKey: string = process.env.JWT_SECRET_KEY || "";

		const token = authPayload.toString().split(" ")[1];

		const decode = jwt.verify(token, secretKey);

		if (!decode) {
			const error = new AppError({
				code: 404,
				message: "Invalid token!",
			});
			return next(error);
		}

		next();
	} catch (err) {
		const error = new AppError({
			code: 404,
			message: "Invalid token!",
		});
		return next(error);
	}
};
