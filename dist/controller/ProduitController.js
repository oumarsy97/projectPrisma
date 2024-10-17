import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import Validation from '../Validation/Validation.js';
export default class ProduitController {
    static addProduit = async (req, res) => {
        const validationResult = Validation.validateProduit.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const idUser = Number(req.params.userId); // Assurez-vous que cette valeur est définie
            const userExists = await prisma.user.findUnique({
                where: { id: idUser }
            });
            if (!userExists) {
                return res.status(400).json({ message: "User not found", status: 400 });
            }
            const actor = await prisma.actor.findUnique({
                where: { idUser: idUser }
            });
            if (actor?.role !== "VENDOR") {
                return res.status(400).json({ message: "Only vendors can add products", status: 400 });
            }
            const credit = actor?.credits || 0;
            if (credit < 10) {
                return res.status(400).json({ message: "Le nombre de credit est insuffisant", status: 400 });
            }
            const produit = await prisma.produit.create({
                data: {
                    libelle: req.body.libelle,
                    description: req.body.description,
                    image: req.body.image,
                    price: req.body.price,
                    qte: req.body.qte,
                    idUser: Number(req.params.userId)
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
            res.json({ message: "Produit created successfully",
                data: produit,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static updateProduit = async (req, res) => {
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
            res.json({ message: "Produit updated successfully",
                data: produit,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static findProduit = async (req, res) => {
        const produit = await prisma.produit.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({ message: "Produit fetched successfully",
            data: produit,
            status: 200
        });
    };
    static findProduitUser = async (req, res) => {
        var idUser = Number(req.params.idUser);
        if (!idUser) {
            idUser = Number(req.params.userId);
        }
        try {
            const produits = await prisma.produit.findMany({
                where: {
                    idUser: idUser
                }
            });
            res.json({ message: "Produits fetched successfully",
                data: produits,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static addCommandeProduit = async (req, res) => {
        const validationResult = Validation.validateCommandeProduit.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const produit = await prisma.produit.findUnique({
                where: {
                    id: req.body.idProduit
                }
            });
            const commande = await prisma.commande.findUnique({
                where: {
                    id: req.body.idCommande
                }
            });
            const price = produit?.price || 0;
            const qte = req.body.qte;
            const commandeProduit = await prisma.commandeProduit.create({
                data: {
                    idProduit: req.body.idProduit,
                    idCommande: req.body.idCommande,
                    qte: qte,
                    price: price
                }
            });
            const montantCmd = commande?.montant || 0;
            const montant = montantCmd + (price * qte);
            const cmd = await prisma.commande.update({
                where: {
                    id: req.body.idCommande,
                },
                data: {
                    montant: montant,
                }
            });
            res.json({ message: "Commande created successfully",
                data: commandeProduit,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static newCommande = async (req, res) => {
        const validationResult = Validation.validateCommande.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        //Doit prendre l'ID de celui qui est connecté (Client)
        try {
            const commande = await prisma.commande.create({
                data: {
                    idUser: Number(req.params.userId),
                    montant: 0,
                }
            });
            res.json({
                message: "Commande created successfully",
                data: commande,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static validerCommande = async (req, res) => {
        const validationResult = Validation.validateCommande.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const commande = await prisma.commande.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    statut: "VALIDATED",
                }
            });
            res.json({
                message: "Commande validated successfully",
                data: commande,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static findCommandeUser = async (req, res) => {
        const idUser = Number(req.params.userId);
        try {
            const commandes = await prisma.commande.findMany({
                where: {
                    idUser: idUser
                }
            });
            res.json({ message: "Produits fetched successfully",
                data: commandes,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static findProduitCommande = async (req, res) => {
        var idCommande = Number(req.params.idCommande);
        try {
            const produits = await prisma.commandeProduit.findMany({
                where: {
                    idCommande: idCommande
                }
            });
            res.json({ message: "Produits fetched successfully",
                data: produits,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Echec",
                error: error.message,
            });
        }
    };
    static findCommandeVendor = async (req, res) => {
        const idVendor = Number(req.params.idVendor); // Utilisation de idProduit
        try {
            const Produits = await prisma.produit.findMany({
                where: {
                    idUser: idVendor
                },
            });
            const commandeProduits = await prisma.commandeProduit.findMany({
                where: {
                    idProduit: {
                        in: Produits.map((produit) => produit.id)
                    }
                }
            });
            const commandes = await prisma.commande.findMany({
                where: {
                    id: {
                        in: commandeProduits.map((commandeProduit) => commandeProduit.idCommande)
                    }
                }
            });
            res.json({ message: "Commandes fetched successfully",
                data: commandes,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({
                message: "Échec",
                error: error.message,
            });
        }
    };
    static noterProduit = async (req, res) => {
        try {
            const { idProduit, note } = req.body;
            const idUser = req.params.userId;
            if (note < 1 || note > 5) {
                return res.status(400).json({ message: "La note doit être comprise entre 1 et 5", status: false });
            }
            const user = await prisma.user.findUnique({
                where: { id: Number(idUser) }
            });
            if (!user)
                return res.status(404).json({ message: "Utilisateur non trouvé", data: null, status: 404 });
            const produit = await prisma.produit.findUnique({
                where: { id: Number(idProduit) },
                include: { notes: true }
            });
            if (!produit)
                return res.status(404).json({ message: "Produit non trouvé", data: null, status: 404 });
            const notesExist = produit.notes.findIndex(r => r.idUser === Number(idUser));
            if (notesExist !== -1) {
                await prisma.notes.update({
                    where: { id: produit.notes[notesExist].id },
                    data: { note }
                });
            }
            else {
                await prisma.notes.create({
                    data: {
                        note,
                        idUser: Number(idUser),
                        produitId: Number(idProduit)
                    }
                });
            }
            res.status(200).json({ message: "Produit noté avec succès", status: true });
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
}
