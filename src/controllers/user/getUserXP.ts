import { Request, Response } from "express";
import User from "../../models/user";
import { filterUserXP } from "./filterUserXP";

export const getTotalUserXP = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { userId } = req.params;

		const user = await User.findById(userId);

		if (user) {
			const { completedTasks, xp } = user;
			const totalUserXP = await filterUserXP(completedTasks);

			res.json({ totalUserXP });
		}
	} catch (error) {
		res.status(404).json({
			msg: "User not found!",
		});

		throw error;
	}
};
