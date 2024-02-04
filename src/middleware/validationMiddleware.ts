import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateAddTaskRules = [
	body("name").notEmpty().withMessage("Name is required"),
	body("description").notEmpty().withMessage("Description is required"),
];

export const validateRemoveTaskRules = [
	body("taskId").notEmpty().withMessage("Task id is required"),
	body("categoryId").notEmpty().withMessage("Category id is required"),
];

export const validateUserRules = [
	body("name").notEmpty().withMessage("Name is required"),
	body("email").notEmpty().withMessage("Email is required"),
	body("password").notEmpty().withMessage("Password is required"),
];

export const validateSigninUserRules = [
	body("email").notEmpty().withMessage("Email is required"),
	body("password").notEmpty().withMessage("Password is required"),
];

export const validateAddCategoryRules = [
	body("name").notEmpty().withMessage("Name is required"),
	body("description").notEmpty().withMessage("Description is required"),
];

export const handleValidationErrors = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	next();
};
