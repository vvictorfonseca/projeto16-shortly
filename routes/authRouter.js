import { Router } from "express";

import { signIn, signUp } from "../controllers/authController.js";
import { validateSignIn, validateSignUp } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/signin", validateSignIn, signIn);
authRouter.post("/signup", validateSignUp, signUp);

export default authRouter;