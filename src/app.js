import express, { json } from "express";
import router from "./routes/test.js";
import cors from "cors"

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentails: true,
  })
);

app.use(json({ limit: "16kb" }));

app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

app.use("/v1", router);

export default app;
