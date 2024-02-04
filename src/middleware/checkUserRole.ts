import {IVerifyTokenRequest} from "../types/express.types";
import {Response, NextFunction} from "express";
import {RolesEnum} from "../enum/Roles.enum";
import AppError from "../helper/appError";

export const checkUserRole = (req: IVerifyTokenRequest, res: Response, next: NextFunction) => {
    const {user} = req;

    if (user && user.role == RolesEnum.ADMIN) {
        return next()
    }

    const error = new AppError({
        code: 403,
        message: "User doesn't have the required role",
    });
    return next(error);

}