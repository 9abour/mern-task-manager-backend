import { Request } from "express";
import { IUser } from "../types/user.types";

export interface IVerifyTokenRequest extends Request {
	user?: IUser;
}
