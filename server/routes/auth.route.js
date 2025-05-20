import express from "express"
import {signupValidation,loginValidation} from "../middlewares/authValidation.js";
import { handleRegisterUser,handleLoginUser,googleAuthCallback} from "../controllers/auth.controller.js";
const router=express.Router();

router.post("/register",signupValidation,handleRegisterUser);
router.post("/login",loginValidation,handleLoginUser);
router.get('/google/callback',googleAuthCallback);


export default router


