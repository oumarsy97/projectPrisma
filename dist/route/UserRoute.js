import UserController from "../controller/UserController.js";
import { Router } from "express";
const router = Router();
router.post("/", UserController.createUser);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);
router.post("/login", UserController.login);

export default router;
