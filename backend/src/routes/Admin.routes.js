import express from "express";
import { handleAdminSignup,handleAdminLogin,handleGetMe } from "../controllers/Admin.controller.js";
import restrictValidUserOnly from "../middlewares/auth.middleware.js";

const router = express.Router();

//handle sign up
router.post("/signup",handleAdminSignup);

//handle login in
router.post("/login",handleAdminLogin);

//handle get me
router.get("/me",restrictValidUserOnly,handleGetMe);

export default router;