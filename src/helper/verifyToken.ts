import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../types/user.types";

/**
 * Verifies a token and returns the decoded user information.
 *
 * @param {string} token - The token to be verified.
 * @return {IUser} The decoded user information.
 */

dotenv.config();
const secretKey: string = process.env.JWT_SECRET_KEY || "";

export const verifyToken = (token: string): IUser => {
	const decode = jwt.verify(token.split(" ")[1], secretKey);

	return decode as IUser;
};
