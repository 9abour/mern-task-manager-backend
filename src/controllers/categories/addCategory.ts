import { NextFunction, Request, Response } from "express";
import { ICategory } from "../../types/category.types";
import Category from "../../models/category";
import AppError from "../../helper/appError";
import asyncWrapper from "../../middleware/asyncWrapper";

export const addCategory = asyncWrapper(
	async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const dataPayload = req.body as Pick<ICategory, "name" | "description">;

		const { name, description } = dataPayload;

		const category = await Category.findOne({ name }).exec();

		if (category) {
			const error = new AppError({
				code: 409,
				message: "The category already exists!",
			});
			next(error);
			return;
		}

		const newCategory = await new Category({
			name,
			description,
			isCompleted: false,
		}).save();

		res.status(201).json({
			message: "The category has been created.",
			category: newCategory,
		});
	}
);
