import { Request, Response } from 'express';
import { PrismaClient, Follow } from '@prisma/client';
import { z } from 'zod';

// Initialisation du Prisma Client
const prisma = new PrismaClient();

// Schéma Zod pour la validation
const followSchema = z.object({
    idActor: z.number().int().positive(),
});

// Types pour les données
type FollowData = {
    idActor: number;
};

interface CustomRequest extends Request {
    userId?: number;
}

class FollowController {
    // Suivre un utilisateur
    static follow = async (req: CustomRequest, res: Response) => {
        const { idActor }: FollowData = req.body;
        const idUser = req.userId;

        // Valider les données d'entrée
        const validation = followSchema.safeParse({ idActor });
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors[0].message });
        }

        try {
            if (!idUser) {
                return res.status(401).json({ error: "Non autorisé" });
            }

            if (idUser === idActor) {
                return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous-même" });
            }

            const follower = await prisma.user.findUnique({ where: { id: idUser } });
            const followed = await prisma.actor.findUnique({ where: { id: idActor } });

            if (!follower || !followed) {
                return res.status(404).json({ error: "Utilisateur ou acteur non trouvé" });
            }

            const existingFollow = await prisma.follow.findUnique({
                where: {
                    idActor_idUser: {
                        idUser: idUser,
                        idActor: idActor,
                    },
                },
            });

            if (existingFollow) {
                return res.status(400).json({ error: "Relation de suivi déjà existante" });
            }

            const follow = await prisma.follow.create({
                data: {
                    idUser: idUser,
                    idActor: idActor,
                },
            });

            res.status(201).json(follow);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    // Ne plus suivre un utilisateur
    static unfollow = async (req: CustomRequest, res: Response) => {
        const { idActor }: FollowData = req.body;
        const idUser = req.userId;

        // Valider les données d'entrée
        const validation = followSchema.safeParse({ idActor });
        if (!validation.success) {
            return res.status(400).json({ error: validation.error.errors[0].message });
        }

        try {
            if (!idUser) {
                return res.status(401).json({ error: "Non autorisé" });
            }

            const follow = await prisma.follow.delete({
                where: {
                    idActor_idUser: {
                        idUser: idUser,
                        idActor: idActor,
                    },
                },
            });

            res.status(200).json(follow);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    // Obtenir les followers d'un utilisateur
    static getFollowers = async (req: CustomRequest, res: Response) => {
        const idActor = parseInt(req.params.id) || req.userId;

        try {
            if (!idActor) {
                return res.status(401).json({ error: "Non autorisé" });
            }

            const followers = await prisma.follow.findMany({
                where: { idActor: idActor },
                include: { user: true },
            });

            res.status(200).json(followers);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    // Obtenir les utilisateurs suivis par un utilisateur
    static getFollowing = async (req: CustomRequest, res: Response) => {
        const idUser = parseInt(req.params.id) || req.userId;

        try {
            if (!idUser) {
                return res.status(401).json({ error: "Non autorisé" });
            }

            const following = await prisma.follow.findMany({
                where: { idUser: idUser },
                include: { actor: true },
            });

            res.status(200).json(following);
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default FollowController;