import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class ShareController {
    static createShare = async (req, res) => {
        try {
            const userId = req.params.userId;
            const fromId = req.body.fromId;
            const idPost = req.body.idPost;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(fromId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(idPost)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            const share = await prisma.share.create({
                data: {
                    fromUserId: Number(userId),
                    toUserId: Number(fromId),
                    idPost: Number(idPost),
                },
            });
            res.json(share);
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    static getSharedMe = async (req, res) => {
        const userId = req.params.userId;
        try {
            const shares = await prisma.share.findMany({
                where: {
                    fromUserId: Number(userId)
                }
            });
            res.json({ message: "Shares fetched successfully",
                data: shares,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    static getSharesToMe = async (req, res) => {
        const userId = req.params.userId;
        try {
            const shares = await prisma.share.findMany({
                where: {
                    toUserId: Number(userId)
                }
            });
            res.json({ message: "Shares fetched successfully",
                data: shares,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    static deleteShare = async (req, res) => {
        const shareId = req.params.shareId;
        try {
            const share = await prisma.share.delete({
                where: {
                    id: Number(shareId)
                }
            });
            res.json({ message: "Share deleted successfully",
                data: share,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    //faire report d'un post
    static createReport = async (req, res) => {
        try {
            const userId = req.params.userId;
            const postId = req.body.postId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            //verifier si l'utilisateur a deja signale
            const signale = await prisma.report.findMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            });
            if (signale.length > 0) {
                //remover le signale
                await prisma.report.deleteMany({
                    where: {
                        idUser: Number(userId),
                        idPost: Number(postId),
                    }
                });
                return res.status(200).json({ message: "Report removed successfully",
                    status: 200
                });
            }
            const newreport = await prisma.report.create({
                data: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                },
            });
            res.json({ message: "Report created successfully",
                data: newreport,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static likePost = async (req, res) => {
        try {
            const userId = req.params.userId;
            const postId = req.body.postId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            const like = await prisma.like.findMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            });
            if (like.length > 0) {
                //remover le signale
                await prisma.like.deleteMany({
                    where: {
                        idUser: Number(userId),
                        idPost: Number(postId),
                    }
                });
                return res.status(200).json({ message: "Like removed successfully",
                    status: 200
                });
            }
            const newlike = await prisma.like.create({
                data: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                },
            });
            res.json({ message: "Like created successfully",
                data: newlike,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static dislikePost = async (req, res) => {
        try {
            const userId = req.params.userId;
            const postId = req.body.postId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            const dislike = await prisma.dislike.findMany({
                where: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                }
            });
            if (dislike.length > 0) {
                //remover le signale
                await prisma.dislike.deleteMany({
                    where: {
                        idUser: Number(userId),
                        idPost: Number(postId),
                    }
                });
                return res.status(200).json({ message: "Dislike removed successfully",
                    status: 200
                });
            }
            const newdislike = await prisma.dislike.create({
                data: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                },
            });
            res.json({ message: "Dislike created successfully",
                data: newdislike,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    //comment 
    static commentPost = async (req, res) => {
        try {
            const userId = req.params.userId;
            const postId = req.params.postId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            const newComment = await prisma.comment.create({
                data: {
                    idUser: Number(userId),
                    idPost: Number(postId),
                    content: req.body.content
                },
            });
            res.json({ message: "Comment created successfully",
                data: newComment,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static deleteComment = async (req, res) => {
        try {
            const userId = req.params.userId;
            const commentId = req.params.commentId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const comment = await prisma.comment.findUnique({
                where: {
                    id: Number(commentId)
                }
            });
            if (comment === null) {
                return res.status(400).json({ message: "Comment not found" });
            }
            await prisma.comment.delete({
                where: {
                    id: Number(commentId)
                }
            });
            res.json({ message: "Comment deleted successfully",
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static updateComment = async (req, res) => {
        try {
            const userId = req.params.userId;
            const commentId = req.params.commentId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const comment = await prisma.comment.findUnique({
                where: {
                    id: Number(commentId)
                }
            });
            if (comment === null) {
                return res.status(400).json({ message: "Comment not found" });
            }
            const newComment = await prisma.comment.update({
                where: {
                    id: Number(commentId)
                },
                data: {
                    content: req.body.content
                },
            });
            res.json({ message: "Comment updated successfully",
                data: newComment,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    //les commentaires d'un post
    static getComments = async (req, res) => {
        try {
            const postId = req.params.postId;
            const comments = await prisma.comment.findMany({
                where: {
                    idPost: Number(postId),
                }
            });
            res.json({ message: "Comments retrieved successfully",
                data: comments,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static createPost = async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const actor = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (actor === null) {
                return res.status(400).json({ message: "Actor not found" });
            }
            const newPost = await prisma.post.create({
                data: {
                    idActor: Number(actor.id),
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.image,
                    description: req.body.description,
                },
            });
            res.json({ message: "Post created successfully",
                data: newPost,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
    static deletePost = async (req, res) => {
        try {
            const userId = req.params.userId;
            const postId = req.params.postId;
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(userId)
                }
            });
            if (user === null) {
                return res.status(400).json({ message: "User not found" });
            }
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            if (post === null) {
                return res.status(400).json({ message: "Post not found" });
            }
            await prisma.post.delete({
                where: {
                    id: Number(postId)
                }
            });
            res.json({ message: "Post deleted successfully",
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };
}
