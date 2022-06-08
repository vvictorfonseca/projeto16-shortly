import { Router } from "express";

import { generateShortUrl, getUrl } from "../controllers/urlController.js";
import { validateToken, validateUrl, validateGetUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, validateUrl, generateShortUrl);
urlRouter.get("/urls/:id", validateGetUrl, getUrl)

export default urlRouter;