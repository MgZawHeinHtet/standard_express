import express, { json } from "express";
import router from "./routes/test.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentails: true,
  })
);

app.use(cookieParser())

app.use(json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use("/v1", router);

app.use("/app/v1",authRouter)

export default app;
