import { Schema, model } from "mongoose";
import { ICategory } from "../types/category.types";

const categorySchema = new Schema(
	{
		name: {
			type: String,
			require: true,
		},
		description: {
			type: String,
			require: true,
		},
	},
	{
		versionKey: false,
	}
);

export default model<ICategory>("Category", categorySchema);
