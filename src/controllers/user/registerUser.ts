import { Request, Response } from "express";
import User from "../../models/user";
import bcrypt from "bcrypt";

/**
 * Registers a new user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} - A promise that resolves to void.
 */

export const registerUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { name, email, password } = req.body;

		const user = await User.findOne({ email }).exec();

		if (user) {
			res.status(409).json({
				errors: [
					{
						msg: "The user already exists!",
					},
				],
			});
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
					msg: "The user has been created.",
				});
			});
		});
	} catch (error) {
		throw error;
	}
};
