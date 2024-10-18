import RepostController from "../controller/RepostController.js";
import Middleware from "../Middleware/Middleware.js";
import { Router } from "express";
const router = Router();
router.post("/repost/:idPost", Middleware.auth, Middleware.isActor, RepostController.createRepost);
router.get("/repostByPost/:idPost", Middleware.auth, Middleware.isActor, RepostController.getRepostsByPost);
router.delete("/deleterepost/:idRepost", Middleware.auth, Middleware.isActor, RepostController.deleteRepost);
router.get("/Allreposts", Middleware.auth, RepostController.getAllRepost);
export default router;
