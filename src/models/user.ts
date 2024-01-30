import { Schema, model } from "mongoose";
import { IUser } from "../types/user.types";

const userSchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			require: true,
		},
		password: {
			type: String,
			require: true,
		},
		completedTasks: [
			{
				type: String,
			},
		],
	},
	{
		versionKey: false,
	}
);

export default model<IUser>("User", userSchema);
