import  UserController  from "../controller/UserController.js";
import { Router } from "express";

const router = Router();
router.post("/", UserController.createUser);
export default router