import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controlller.js";
import { upload } from "../middleWares/multer.middlewares.js";
import { VerifyJwt } from "../middleWares/auth.middleware.js";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
// secured Routes
router.route("/logout").post(VerifyJwt, logoutUser);

export default router;
