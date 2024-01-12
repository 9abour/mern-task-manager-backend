import { Request, Response } from "express";
import { ICategory } from "../../types/category.types";
import Category from "../../models/category";

export const addCategory = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const dataPayload = req.body as Pick<ICategory, "name" | "description">;

		const { name, description } = dataPayload;

		const category = await Category.findOne({ name }).exec();

		if (category) {
			res.status(409).json({
				errors: [
					{
						msg: "The category already exists!",
					},
				],
			});
			return;
		}

		const newCategory = await new Category({
			name,
			description,
			isCompleted: false,
		}).save();

		res.status(201).json({
			msg: "The category has been created.",
			category: newCategory,
		});
	} catch (error) {
		throw error;
	}
};
