import { Router } from "express";
import { addTask, getAllTasks, getTask } from "../../controllers/tasks";
import { removeTask } from "../../controllers/tasks/removeTask";
import { toggleTask } from "../../controllers/tasks/toggleTask";
import {
	handleValidationErrors,
	validateAddTaskRules,
	validateRemoveTaskRules,
} from "../../middleware/validationMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import {checkUserRole} from "../../middleware/checkUserRole";

const taskRouter = Router();

taskRouter.get("/tasks", getAllTasks);
taskRouter.post(
	"/tasks",
	verifyToken,
	checkUserRole,
	validateAddTaskRules,
	handleValidationErrors,
	addTask
);
taskRouter.delete(
	"/tasks",
	verifyToken,
	checkUserRole,
	validateRemoveTaskRules,
	handleValidationErrors,
	removeTask
);
taskRouter.get("/tasks/:taskId", getTask);
taskRouter.post("/toggleTask/:taskId", verifyToken, toggleTask);

export default taskRouter;
