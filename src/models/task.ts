import { Schema, model } from "mongoose";
import { ITask } from "../types/task.types";

const taskSchema: Schema = new Schema(
	{
		name: String,
		description: String,
		xp: Number,
		isCompleted: Boolean,
		categories: [
			{
				type: String,
			},
		],
	},
	{
		versionKey: false,
	}
);

export default model<ITask>("Task", taskSchema);
