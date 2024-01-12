import { Router } from "express";
import { getTotalUserXP } from "../../controllers/user/getUserXP";
import { getUserTasks } from "../../controllers/user/getUserTasks";
import {
	handleValidationErrors,
	validateSigninUserRules,
	validateUserRules,
} from "../../middleware/validation/validationMiddleware";
import { registerUser } from "../../controllers/user/registerUser";
import { getUser } from "../../controllers/user/getUser";
import { signinUser } from "../../controllers/user/signinUser";

const userRouter = Router();

userRouter.get("/users/xp/:userId", getTotalUserXP);
userRouter.get("/users/tasks/:userId", getUserTasks);
userRouter.post(
	"/register",
	validateUserRules,
	handleValidationErrors,
	registerUser
);
userRouter.get("/whoami", getUser);
userRouter.post(
	"/singin",
	validateSigninUserRules,
	handleValidationErrors,
	signinUser
);

export default userRouter;
