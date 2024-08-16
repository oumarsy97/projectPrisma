import  RepostController  from "../controller/RepostController.js";
import { Router } from "express";

const router = Router();

router.post("/repost", RepostController.createRepost);
router.get("/repostByPost/:idPost",RepostController.getRepostsByPost);
router.delete("/deleterepost/:idRepost", RepostController.deleteRepost);
router.delete("/Allreposts", RepostController.getAllRepost);
export default router