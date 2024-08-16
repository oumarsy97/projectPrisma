import  UserController  from "../controller/UserController.js";
import { Router } from "express";

const router = Router();
router.post("/", UserController.createUser);
router.post("/ajoutercredits", UserController.ajouterCredit);
router.post("/achatcode", UserController.achatCode);
export default router