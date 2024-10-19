import { Router } from "express";
import Middleware from "../Middleware/Middleware.js";
import PostController from "../controller/PostController.js";
const router = Router();

//like
router.post("/like/:postId", Middleware.auth, PostController.likePost);

//post  
router.post("/", Middleware.auth,Middleware.isTailor, PostController.createPost);
router.get("/others", Middleware.auth, PostController.getPostsWithoutMe);
router.get("/", Middleware.auth, PostController.allposts);
router.get("/myposts", Middleware.auth,Middleware.isTailor, PostController.mypost);
router.get("/byactor", Middleware.auth, PostController.getPostActor);
router.put("/:postId", Middleware.auth,Middleware.isTailor, PostController.updatepost);
router.delete("/:id", Middleware.auth,Middleware.isTailor, PostController.deletePost);
//share
router.post("/shares/", Middleware.auth, PostController.createShare);
router.get("/shares/myshares", Middleware.auth, PostController.getSharedMe);
router.get("shares/sharedwithme", Middleware.auth,Middleware.isActor, PostController.getSharesToMe);
router.delete("/shares/:id", Middleware.auth,Middleware.isActor, PostController.deleteShare);
//report
router.post("/report/:postId", Middleware.auth, PostController.createReport);
//comment
router.post("/comment/:postId", Middleware.auth, PostController.commentPost);
router.get("/comment/:postId", Middleware.auth, PostController.getComments);
router.put("/comment/:id", Middleware.auth, PostController.updateComment);
router.delete("/comment/:id", Middleware.auth, PostController.deleteComment);

//tag 
router.post("/tag/:postId", Middleware.auth,Middleware.isActor, PostController.createtag);
router.get("/tag/:postId", Middleware.auth,Middleware.isActor, PostController.gettag);
router.get("/tagbypost/:postId", Middleware.auth, PostController.gettag);
//favoris
router.post("/favoris/:postId", Middleware.auth, PostController.addfavoris);
router.get("/myfavoris", Middleware.auth, PostController.getfavoris);
//noter
router.post("/notes", Middleware.auth, PostController.noterPost);
router.get("/notes/:idPost", Middleware.auth, PostController.getNotes);
router.get('/:postId/view', PostController.viewPost);



export default router;