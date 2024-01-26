import { IVerifyTokenRequest } from "./../types/express.types";
import jwt from "jsonwebtoken";
import { Request, NextFunction, Response } from "express";
import AppError from "../helper/appError";
import { IUser } from "../types/user.types";

/**
 * Verifies a token and returns the decoded user information.
 *
 * @param {string} token - The token to be verified.
 * @return {IUser} The decoded user information.
 */

export const verifyToken = (
	req: IVerifyTokenRequest,
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

		const decode = jwt.verify(token, secretKey) as IUser;

		if (!decode) {
			const error = new AppError({
				code: 404,
				message: "Invalid token!",
			});
			return next(error);
		}

		req.user = decode;

		next();
	} catch (err) {
		const error = new AppError({
			code: 404,
			message: "Invalid token!",
		});
		return next(error);
	}
};
