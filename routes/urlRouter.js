import { Router } from "express";

import { generateShortUrl, getUrl, getShortUrl, deleteUrl } from "../controllers/urlController.js";
import { validateToken, validateUrl, validateGetUrl, validateShortUrl, validateDeleteUrl } from "../middlewares/urlMiddleware.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateToken, validateUrl, generateShortUrl);
urlRouter.get("/urls/:id", validateGetUrl, getUrl);
urlRouter.get("/urls/open/:shortUrl", validateShortUrl, getShortUrl);
urlRouter.delete("/urls/:id", validateToken, validateDeleteUrl, deleteUrl);

export default urlRouter;