import { Request, Response, NextFunction } from "express";

const asyncWrapper = <T>(
	asyncFC: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
	return (req: Request, res: Response, next: NextFunction) => {
		asyncFC(req, res, next).catch(error => {
			next(error);
		});
	};
};

export default asyncWrapper;
