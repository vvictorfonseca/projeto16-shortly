import { Router } from "express";

import generateShortUrl from "../controllers/urlController.js";
import { validateToken, validateUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, validateUrl, generateShortUrl);

export default urlRouter;