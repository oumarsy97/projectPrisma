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
       const idUser = req.params.userId;
       const idActor = req.body.idActor;
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
                return res.status(400).json({ error: "Vous ne pouvez pas vous suivre vous déj'é !" });
            }
            const follower = await prisma.follow.findFirst({ where: { 
                idUser: +idUser,
                idActor: idActor
             } });
            if (follower) {
                const deleteFollow = await prisma.follow.delete({
                    where: {
                        id: follower.id
                    }
                
                });
                res.status(200).json({
                    message: "Relation de suivi supprimée",
                    data: deleteFollow,
                    status: true
                });
                return
            }

            const follow = await prisma.follow.create({
                data: {
                    idUser: +idUser,
                    idActor: idActor
                },
            });
            res.status(201).json({
                message: "Relation de suivi enregistrée",
                data: follow,
                status: true
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
 };


    // Obtenir les followers d'un utilisateur
    static getFollowers = async (req: CustomRequest, res: Response) => {
       const idUser = parseInt(req.params.userId) || req.userId;
       const user = await prisma.user.findUnique({
           where: { id: idUser },
       });

       if (!user) {
           return res.status(404).json({ error: "Utilisateur non trouvé" });
       }
       const actor = await prisma.actor.findUnique({
           where: { idUser: user.id },
       });

        try {
            if (!actor) {
                return res.status(401).json({ error: "t'es pas un acteur" });
            } 

            const followers = await prisma.follow.findMany({
                where: { idActor: actor.id },
                include: { user: true },
            });

            res.status(200).json({
                message: "Liste des utilisateurs suivis",
                data: followers,
                status: true
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };

    // Obtenir les utilisateurs suivis par un utilisateur
    static getFollowing = async (req: CustomRequest, res: Response) => {
        const idUser = parseInt(req.params.userId) || req.userId;

        try {
            if (!idUser) {
                return res.status(401).json({ error: "Non autorisé" });
            }

            const following = await prisma.follow.findMany({
                where: { idUser: idUser },
                include: { actor: true },
            });

            res.status(200).json({
                message: "Liste des utilisateurs suivis",
                data: following,
                status: true
            });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    };
}

export default FollowController;