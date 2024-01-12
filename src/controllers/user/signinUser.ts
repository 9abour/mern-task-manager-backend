import { IUser } from "../../types/user.types";
import { Request, Response } from "express";
import User from "../../models/user";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Sign in a user.
 *
 * @param {Request} req - the request object
 * @param {Response} res - the response object
 * @return {Promise<void>} - a promise that resolves to void
 */

const secretKey: string = process.env.JWT_SECRET_KEY || "";

export const signinUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body as Pick<IUser, "email" | "password">;

		const dataPayload = {
			email,
			password,
		};

		const user = await User.findOne({ email });

		if (!user) {
			res.status(401).json({
				errors: [{ msg: "Wrong email!" }],
			});
			return;
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			res.status(401).json({
				errors: [{ msg: "Wrong password!" }],
			});
			return;
		}

		const token = jwt.sign(dataPayload, secretKey);

		res.json(token);
	} catch (error) {
		throw error;
	}
};
