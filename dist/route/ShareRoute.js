import ShareController from "../controller/PostController.js";
import { Router } from "express";
import Middleware from "../Middleware/Middelware.js";
const router = Router();
router.post("/", Middleware.auth, ShareController.createShare);
router.get("/myshares", Middleware.auth, ShareController.getSharedMe);
router.get("/sharedwithme", Middleware.auth, ShareController.getSharesToMe);
router.delete("/:id", Middleware.auth, ShareController.deleteShare);
export default router;
