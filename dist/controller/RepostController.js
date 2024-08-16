var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class RepostController {
}
_a = RepostController;
RepostController.createRepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPost = Number(req.params.idPost);
    const { idUser } = req.body;
    try {
        const actor = yield prisma.actor.findUnique({
            where: {
                idUser: idUser
            }
        });
        if (!actor || actor.role !== "TAILOR") {
            return res.status(403).json({
                message: "Only tailor can repost ! Mouy mboli di deme ",
                status: 403,
            });
        }
        const Originalpost = yield prisma.post.findUnique({
            where: {
                id: idPost
            }
        });
        if (Originalpost && Originalpost.idActor === actor.id) {
            return res.status(400).json({
                message: "Vous ne pouvez pas reposter votre propre post.",
                status: 400,
            });
        }
        const exist = yield prisma.repost.findFirst({
            where: {
                idUser: idUser,
                idPost: idPost,
            },
        });
        if (exist) {
            return res.status(400).json({
                message: "Vous avez déjà reposté ce post.",
                status: 400,
            });
        }
        const repost = yield prisma.repost.create({
            data: {
                idUser: idUser,
                idPost: idPost,
            },
        });
        res.json({
            message: "Repost créé avec succès",
            data: repost,
            status: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: error.message,
        });
    }
});
RepostController.deleteRepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idRepost = Number(req.params.idRepost);
    const { idUser } = req.body;
    try {
        const actor = yield prisma.actor.findUnique({
            where: {
                idUser: idUser
            }
        });
        if (!actor || actor.role !== "TAILOR") {
            return res.status(403).json({
                message: "Only tailor can delete repost! Mouy mboli di deme ",
                status: 403,
            });
        }
        const repost = yield prisma.repost.findUnique({
            where: {
                id: idRepost
            }
        });
        if (!repost || repost.idUser !== idUser) {
            return res.status(403).json({
                message: "Vous ne pouvez pas supprimer ce repost.",
                status: 403,
            });
        }
        yield prisma.repost.delete({
            where: {
                id: idRepost
            }
        });
        res.json({
            message: "Repost supprimé avec succès",
            status: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: error.message,
        });
    }
});
RepostController.getRepostsByPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idPost = Number(req.params.idPost);
    try {
        const reposts = yield prisma.repost.findMany({
            where: {
                idPost: idPost
            },
            include: {
                user: true,
            }
        });
        res.json({
            message: "Reposts récupérés avec succès",
            data: reposts,
            status: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: error.message,
        });
    }
});
//get all repost
RepostController.getAllRepost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reposts = yield prisma.repost.findMany();
        res.json({
            message: "Reposts récupérés avec succès",
            data: reposts,
            status: 200,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur interne du serveur",
            error: error.message,
        });
    }
});
export default RepostController;
