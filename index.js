import dotenv from "dotenv";
import express, { json } from "express";
import chalk from "chalk";
import cors from "cors";

import authRouter from "./routes/authRouter.js";
import urlRouter from "./routes/urlRouter.js";
import userRouter from "./routes/userRouter.js";

dotenv.config()

const app = express();
app.use(cors());
app.use(json());

app.use(authRouter);
app.use(urlRouter);
app.use(userRouter);

app.listen( process.env.PORT, () => {
    console.log(chalk.bold.green(`Server is good to go on ${process.env.PORT}`))
});