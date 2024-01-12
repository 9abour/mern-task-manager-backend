import { Router } from "express";
import { addTask, getAllTasks, getTask } from "../../controllers/tasks";
import { removeTask } from "../../controllers/tasks/removeTask";
import { toggleTask } from "../../controllers/tasks/toggleTask";
import {
	handleValidationErrors,
	validateAddTaskRules,
	validateRemoveTaskRules,
} from "../../middleware/validation/validationMiddleware";

const taskRouter = Router();

taskRouter.get("/tasks", getAllTasks);
taskRouter.post(
	"/tasks",
	validateAddTaskRules,
	handleValidationErrors,
	addTask
);
taskRouter.delete(
	"/tasks",
	validateRemoveTaskRules,
	handleValidationErrors,
	removeTask
);
taskRouter.get("/tasks/:taskId", getTask);
taskRouter.post("/toggleTask/:taskId", toggleTask);

export default taskRouter;
