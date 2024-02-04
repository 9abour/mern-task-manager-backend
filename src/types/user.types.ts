import {RolesEnum} from "../enum/Roles.enum";

export interface IUser {
	name: string;
	email: string;
	password: string;
	completedTasks: string[];
	role: RolesEnum
}
