import  UserController  from "../controller/UserController.js";
import { Router } from "express";
import Middleware from "../Middleware/Middelware.js";

const router = Router();
router.post("/", UserController.createUser);
router.post("/login", UserController.login);
router.get("/monprofile",Middleware.auth, UserController.getUser);
router.post("/ajoutercredits" ,Middleware.auth, UserController.addCredit);
router.post("/achatcode" ,Middleware.auth, UserController.achatCode);
router.get("/credits", Middleware.auth, UserController.getCredits);
export default router
