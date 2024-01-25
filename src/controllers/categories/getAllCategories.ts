import { Request, Response } from "express";
import Category from "../../models/category";
import asyncWrapper from "../../middleware/asyncWrapper";

export const getAllCategories = asyncWrapper(
	async (req: Request, res: Response) => {
		const categories = await Category.find();
		res.status(200).json(categories);
	}
);
