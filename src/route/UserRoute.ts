import  UserController  from "../controller/UserController.js";
import { Router } from "express";
import Middleware from "../Middleware/Middelware.js";

const router = Router();
router.post("/", UserController.createUser);
router.post("/login", UserController.login);
router.get("/monprofile",Middleware.auth, UserController.getUser);
export default router