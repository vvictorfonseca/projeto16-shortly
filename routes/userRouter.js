import { Router } from "express";

import { getUserInfo, getRanking } from "../controllers/userController.js";
import { validateToken }  from "../middlewares/urlMiddleware.js";

const userRouter = Router();

userRouter.get("/users/:id", validateToken, getUserInfo);
userRouter.get("/ranking", getRanking);

export default userRouter;