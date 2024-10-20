import  ActorController  from "../controller/ActorController.js";
import { Router } from "express";
import Middleware from "../Middleware/Middleware.js";

const router = Router();
router.get("/monprofile", Middleware.auth, ActorController.getActorsByUserId);
router.post("/create", ActorController.createActor);
router.get("/getactor", Middleware.auth, ActorController.getActors);
router.get("/getbestActor", Middleware.auth, ActorController.getActorsWithoutMe);
router.get("/getactor/:id", Middleware.auth, ActorController.getActorById);
router.get("/deleteactor/:id", Middleware.auth, ActorController.deleteActor);
router.put("/update/:id", Middleware.auth, ActorController.updateActor);
export default router