import { Request, Response } from "express";
import User from "../../models/user";
import { verifyToken } from "../../helper/verifyToken";

/**
 * Retrieves user information based on the provided request.
 *
 * @param {Request} req - The request object containing the user token.
 * @param {Response} res - The response object used to send the user information.
 * @return {Promise<void>} - A promise that resolves when the user information has been sent or rejects if an error occurs.
 */

export const getUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const token = req.headers["authorization"];

		if (!token) {
			res.status(404).json({
				errors: [
					{
						msg: "Token not provided!",
					},
				],
			});
			return;
		}

		const { email } = verifyToken(token);

		const user = await User.findOne({ email });

		if (!user) {
			res.status(401).json({
				errors: [
					{
						msg: "Unauthenticated!",
					},
				],
			});
			return;
		}

		const { _id, name, completedTasks, xp } = user;

		res.json({
			_id,
			name,
			email: user.email,
			completedTasks,
			xp,
		});
	} catch (error) {
		throw error;
	}
};
