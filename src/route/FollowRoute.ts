import FollowController from "../controller/FollowController.js";
import Middleware from "../Middleware/Middleware.js";
import express from "express";

const router = express.Router();

router.post("/follow/:idActor", Middleware.auth, FollowController.follow);
router.post("/unfollow", Middleware.auth, FollowController.follow);
router.get("/myfollowers", Middleware.auth, FollowController.getFollowers);
router.get("/myfollowing", Middleware.auth, FollowController.getFollowing);
router.get("/followerbytailor/:id", Middleware.auth, FollowController.getFollowers);
router.get("/followingbytailor/:id", Middleware.auth, FollowController.getFollowing);
router.get("/getFollowers/:id", Middleware.auth, FollowController.getFollowers);
router.get("/getFollowing/:id", Middleware.auth, FollowController.getFollowing);
router.get("/getMyFollowers", Middleware.auth, FollowController.getFollowers);
router.get("/getMyFollowing", Middleware.auth, FollowController.getFollowing);

export default router;
