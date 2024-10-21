import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';

const prisma = new PrismaClient();
import { Request, Response } from "express";
import Validation from '../Validation/Validation.js';

export default class ProduitController {

    static addProduit = async (req: Request, res: Response) => {
        // const validationResult = Validation.validateProduit.safeParse(req.body);
        // if(!validationResult.success) {
        //     return res.status(400).json({message: validationResult.error.message, status: 400});
        // }
        try {
            const idUser = Number(req.params.userId);
            console.log("idUser", idUser);
            
            const userExists = await prisma.user.findUnique({
                where: { id: idUser }
            });
            if (!userExists) {
                return res.status(400).json({ message: "User not found", status: 400 });
            }
            const actor = await prisma.actor.findUnique({
                where: { idUser: idUser }
            });
            const credit = actor?.credits || 0;
            if (credit < 10) {
                return res.status(400).json({ message: "Le nombre de credit est insuffisant", status: 400 });
            }

            const produit = await prisma.produit.create({
                data: {
                    libelle: req.body.libelle,
                    description: req.body.description,
                    image: req.body.image,
                    price: parseFloat(req.body.price),
                    qte: parseInt(req.body.qte),
                    idUser: idUser
                }
            });
            const credits = credit - 10;
            const act = await prisma.actor.update({
                where: {
                    idUser: Number(req.params.userId),
                },
                data: {
                    credits: credits,
                }
            });
    
            res.json({message: "Produit created successfully",
                data: produit,
                status: 200
            });  
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static getProduit = async (req: Request, res: Response) => {
        try {
            const produits = await prisma.produit.findMany();
            res.json({ message: "Produits fetched successfully",
                data: produits,
                status: 200
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };

    static updateProduit = async (req: Request, res: Response) => {
        /* const validationResult = Validation.validateProduit.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        } */
        try {
            const produit = await prisma.produit.update({
                where: {
                    id: Number(req.params.id)
                },
                data: req.body
            });
            res.json({message: "Produit updated successfully",
                data: produit,
                status: 200
            });
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static findProduit = async (req: Request, res: Response) => {
        const produit = await prisma.produit.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({message: "Produit fetched successfully",
            data: produit,
            status: 200
        });
    }

    static findProduitUser = async (req: Request, res: Response) => {
        var idUser: number = Number(req.params.idUser);
        if (!idUser) {
            idUser = Number(req.params.userId);
        }
        try {
            const produits = await prisma.produit.findMany({
                where: {
                    idUser: idUser
                }
            });
            res.json({message: "Produits fetched successfully",
                data: produits,
                status: 200
            });
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static addCommandeProduit = async (req: Request, res: Response) => {
        const validationResult = Validation.validateCommandeProduit.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        }
        try {
            const produit = await prisma.produit.findFirst({
                where: {
                    id: req.body.idProduit
                }
            });
            const commande = await prisma.commande.findFirst({
                where: {
                    id: req.body.idCommande
                }
            });
            const price = produit?.price || 0;
            const qte = req.body.qte;
            const montantCommande = commande?.montant || 0;
            const montant = price * qte + montantCommande;

            let produits = await prisma.commandeProduit.findFirst({
                where: {
                    idProduit: req.body.idProduit,
                    idCommande: req.body.idCommande
                }
            });
            
            if (produits != null) {
                if (produit?.qte || 0 >= qte) {
                    produits = await prisma.commandeProduit.update({
                        where: {
                            id: produits.id,
                        },
                        data: {
                            qte: produits.qte + qte,
                        }
                    });
                    
                    await prisma.commande.update({
                        where: {
                            id: commande?.id
                        },
                        data: {
                            montant: montant,
                        }
                    });
                    
                    return res.json({
                        message: "Produit ajouté à la commande",
                        data: produits,
                        status: 200
                    });
                }
                else {
                    return res.status(400).json({ message: "Quantité insuffisante", status: 400 });
                }
            }
            

            const commandeProduit = await prisma.commandeProduit.create({
                data: {
                    idProduit: req.body.idProduit,
                    idCommande: req.body.idCommande,
                    qte: qte,
                    price: price
                }
            });

            await prisma.commande.update({
                where: {
                    id: commande?.id || 0
                },
                data: {
                    montant: montant,
                }
            });

            res.json({message: "Commande created successfully",
                data: commandeProduit,
                status: 200
            });  
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static newCommande = async (req: Request, res: Response) => {
        const validationResult = Validation.validateCommande.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        //Doit prendre l'ID de celui qui est connecté (Client)
        try {
            let commandes = await prisma.commande.findFirst({
                where: {
                    idUser: Number(req.body.idUser),
                    idActor: Number(req.body.actorId),
                    statut: "PENDING",
                }
            });
            
            if (commandes?.id != null && commandes?.id != undefined) {
                commandes = await prisma.commande.update({
                    where: {
                        id: commandes.id,
                    },
                    data: {
                        montant: commandes.montant + parseFloat(req.body.montant),
                    }
                });
                return res.json({
                    message: "Une commande est déjà en cours",
                    data: commandes,
                    status: 400
                });
            }
            const commande = await prisma.commande.create({
                data: {
                    idUser: Number(req.body.idUser),
                    idActor: Number(req.body.actorId),
                    montant: parseFloat(req.body.montant),
                }
            });

            res.json({
                message: "Commande created successfully",
                data: commande,
                status: 200
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static validerCommande = async (req: Request, res: Response) => {
        // const validationResult = Validation.validateCommande.safeParse(req.body);
        // if (!validationResult.success) {
        //     return res.status(400).json({ message: validationResult.error.message, status: 400 });
        // }
        try {
            const commande = await prisma.commande.update({
                where: {
                    id: Number(req.params.id),
                    statut: "PENDING",
                },
                data: {
                    statut: "VALIDATED",
                }
            });

            const produits = await prisma.commandeProduit.findMany({
                where: {
                    idCommande: Number(req.params.id),
                }
            });

            for (let i = 0; i < produits.length; i++) {
                await prisma.produit.update({
                    where: {
                        id: produits[i].idProduit
                    },
                    data: {
                        qte:  { decrement: produits[i].qte }
                    }
                })
            }

            res.json({
                message: "Commande validated successfully",
                data: commande,
                status: 200
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static annulerCommande = async (req: Request, res: Response) => {
        try {
            const commande = await prisma.commande.update({
                where: {
                    id: Number(req.params.id),
                    statut: "PENDING",
                },
                data: {
                    statut: "CANCELED",
                }
            });


            const produits = await prisma.commandeProduit.deleteMany({
                where: {
                    idCommande: Number(req.params.id),
                }
            });

            res.json({
                message: "Commande canceled successfully",
                data: commande,
                status: 200
            });
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static findCommandeUser = async (req: Request, res: Response) => {
        const idUser = Number(req.params.userId);
        try {
            const commandes = await prisma.commande.findMany({
                where: {
                    idUser: idUser
                }
            });
            
            res.json({message: "Produits fetched successfully",
                data: commandes,
                status: 200
            });
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static findProduitCommande = async (req: Request, res: Response) => {
        var idCommande = Number(req.params.idCommande);
        try {
            const produits = await prisma.commandeProduit.findMany({
                where: {
                    idCommande: idCommande
                }
            });
            res.json({message: "Produits fetched successfully",
                data: produits,
                status: 200
            });
        }
        catch (error: any) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    }

    static findCommandeVendor = async (req: Request, res: Response) => {
        const idVendor = Number(req.params.idVendor);
        try {
            const commandes = await prisma.commande.findMany({
                where: {
                    idActor: idVendor,
                },
                include: {
                    user: true,
                    produits: true
                }
            });

            const produitCommandes = await prisma.produit.findMany({
                where: {
                    id: {
                        in: commandes?.flatMap((commande) => commande.produits.map((produit) => produit.idProduit))
                    }
                }
            });

            const updatedCommandes = commandes.map((commande) => {
                const updatedProduits = produitCommandes
                    .filter((produit) => commande.produits.some((commandeProduit) => commandeProduit.idProduit === produit.id))
                    .map((produit) => ({
                        id: produit.id,
                        idCommande: commande.id,
                        idProduit: produit.id,
                        qte: commande.produits.find(cp => cp.idProduit === produit.id)?.qte || 0,
                        price: produit.price,
                        libelle: produit.libelle,
                        description: produit.description,
                        image: produit.image
                    }));
                return { ...commande, produits: updatedProduits };
            });

            res.json({
                message: "Commandes fetched successfully",
                data: updatedCommandes,
                status: 200
            });
        } catch (error: any) {
            res.status(500).json({
                message: "Échec",
                error: error.message,
            });
        }
    }

    static noterProduit = async (req: Request, res: Response) => {
        try {
            const { idProduit, note } = req.body;
            const idUser = req.params.userId;
    
            if (note < 1 || note > 5) {
                return res.status(400).json({ message: "La note doit être comprise entre 1 et 5", status: false });
            }
    
            const user = await prisma.user.findUnique({
                where: { id: Number(idUser) }
            });
            if (!user) return res.status(404).json({ message: "Utilisateur non trouvé", data: null, status: 404 });
    
            const produit = await prisma.produit.findUnique({
                where: { id: Number(idProduit) },
                include: { notes: true }
            });
            if (!produit) return res.status(404).json({ message: "Produit non trouvé", data: null, status: 404 });
    
        const notesExist = produit.notes.findIndex(r => r.idUser === Number(idUser));  
        if (notesExist !== -1) {
            await prisma.notes.update({
                where: { id: produit.notes[notesExist].id },
                data: { note }
            });
        } else {
            await prisma.notes.create({
                data: {
                    note,
                    idUser: Number(idUser),
                    produitId: Number(idProduit)
                }
            });
        
        }
        res.status(200).json({ message: "Produit noté avec succès", status: true });
        } catch (error: any) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    }

}