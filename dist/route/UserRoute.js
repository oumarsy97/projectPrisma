import UserController from "../controller/UserController.js";
import { Router } from "express";
import Middleware from "../Middleware/Middleware.js";
const router = Router();
router.post("/becometailor", Middleware.auth, UserController.becomeTailor);
router.post("/becomevendor", Middleware.auth, UserController.becomeVendor);
router.get("/monprofile", Middleware.auth, UserController.getUser);
router.post("/login", UserController.login);
router.get("/credits", Middleware.auth, Middleware.isActor, UserController.getCredits);
router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
//credit 
router.post("/ajoutercredits", Middleware.auth, Middleware.isActor, UserController.addCredit);
router.post("/achatcode", Middleware.auth, Middleware.isActor, UserController.achatCode);
export default router;
