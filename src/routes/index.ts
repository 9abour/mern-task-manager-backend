import { Router } from "express";
import userRouter from "./user";
import taskRouter from "./task";
import categoryRouter from "./category";

const router = Router();

router.use(userRouter);
router.use(taskRouter);
router.use(categoryRouter);

export default router;
