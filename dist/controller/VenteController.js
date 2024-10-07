import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class VenteController {
    static getmyVentes = async (req, res) => {
        const idUser = req.params.userId;
        const actor = await prisma.actor.findUnique({
            where: {
                idUser: +idUser,
            }
        });
        if (!actor) {
            return res.status(404).json({
                message: "Actor not found",
                data: null,
            });
        }
        const ventes = await prisma.vente.findMany({
            where: {
                idUser: +actor.id
            },
            include: {
                venteDetails: {
                    include: {
                        produit: true
                    }
                }
            }
        });
        res.status(200).json(ventes);
    };
    static createVente = async (req, res) => {
        try {
            const idUser = req.params.userId;
            const actor = await prisma.actor.findUnique({
                where: {
                    idUser: +idUser,
                },
            });
            if (!actor) {
                return res.status(404).json({
                    message: "Actor not found",
                    data: null,
                });
            }
            const client = req.body.idclient;
            const produits = req.body.produits;
            if (!produits || !Array.isArray(produits) || produits.length === 0) {
                return res.status(400).json({
                    message: "Invalid request data: produits must be a non-empty array",
                    data: null,
                });
            }
            let totalVente = 0;
            const venteDetails = [];
            for (const produitInfo of produits) {
                const produit = await prisma.produit.findUnique({
                    where: {
                        id: +produitInfo.idProduit,
                    },
                });
                if (!produit) {
                    return res.status(404).json({
                        message: `Produit with id ${produitInfo.idProduit} not found`,
                        data: null,
                    });
                }
                const quantity = produitInfo.qte;
                const price = Number(produit.price);
                const montant = quantity * price;
                totalVente += montant;
                venteDetails.push({
                    idProduit: produit.id,
                    quantity: quantity,
                    price: price,
                    montant: montant,
                });
            }
            // Create the vente
            const newVente = await prisma.vente.create({
                data: {
                    idUser: +client,
                    idActor: actor.id,
                    totalAmount: totalVente, // optional field to store total vente amount
                    venteDetails: {
                        create: venteDetails,
                    },
                },
                include: {
                    venteDetails: true, // Include the details in the response
                },
            });
            res.status(201).json({
                message: "Vente created successfully",
                data: newVente,
            });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({
                message: "An error occurred while creating the vente",
                error: error.message,
            });
        }
    };
    //les ventes sur un produit
    static getVenteByProduit = async (req, res) => {
        const idProduit = req.params.idProduit;
        const userId = req.params.userId;
        try {
            const actor = await prisma.actor.findUnique({
                where: {
                    idUser: +userId
                }
            });
            if (!actor) {
                return res.status(404).json({
                    message: "Actor not found",
                    data: null,
                });
            }
            const produits = await prisma.vente.findUnique({
                where: {
                    id: +idProduit
                }
            });
            if (!produits) {
                return res.status(404).json({
                    message: "Produit not found",
                    data: null,
                });
            }
            if (produits.idUser !== actor.id) {
                return res.status(404).json({
                    message: "You are not allowed to access this data",
                    data: null,
                });
            }
            const ventes = await prisma.vente.findMany({
                include: {
                    venteDetails: true,
                }
            });
            res.status(200).json({
                message: "Vente found successfully",
                data: ventes,
                status: true
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message, data: null, status: false });
        }
    };
}
