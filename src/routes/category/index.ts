import { Router } from "express";
import { addCategory } from "../../controllers/categories/addCategory";
import { getAllCategories } from "../../controllers/categories/getAllCategories";
import { getAllTaskCategories } from "../../controllers/categories/getAllTaskCategories";
import { getCategoryTasks } from "../../controllers/categories/getCategoryTasks";
import { getCategoryTasksCount } from "../../controllers/categories/getCategoryTasksCount";
import { removeCategory } from "../../controllers/categories/removeCategory";
import {
	handleValidationErrors,
	validateAddCategoryRules,
} from "../../middleware/validationMiddleware";
import { verifyToken } from "../../middleware/verifyToken";
import {checkUserRole} from "../../middleware/checkUserRole";

const categoryRouter = Router();

categoryRouter.post(
	"/categories",
	verifyToken,
	checkUserRole,
	validateAddCategoryRules,
	handleValidationErrors,
	addCategory
);
categoryRouter.delete("/categories/:categoryId", verifyToken, checkUserRole, removeCategory);
categoryRouter.get("/categories", getAllCategories);
categoryRouter.get("/categories/tasks/:categoryId", getCategoryTasks);
categoryRouter.get("/categories/tasksCount/:categoryId", getCategoryTasksCount);
categoryRouter.get("/taskCategories/:taskId", getAllTaskCategories);

export default categoryRouter;
