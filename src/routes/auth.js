import { Router } from "express";
import { loginController, registerController } from "../controllers/auth.js";
import { upload } from "../middlewares/multer.js";
const authRouter = Router();

authRouter.post(
  "/register",
  upload.fields([
    { name: "profile_photo", maxCount: 1 },
    { name: "cover_photo", maxCount: 1 },
  ]),
  registerController
);

authRouter.post("/login",loginController)

export default authRouter;
