import { PrismaClient } from "@prisma/client";
import Utils from "../utils/Utils.js";
import upload from '../config/multerConfig.js';
const prisma = new PrismaClient();
import Messenger from "../utils/Messenger.js";
export default class ActorController {
    //create a new actor
    static createActor = async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: err.message });
            }
            try {
                const { role } = req.body;
                if (role !== "TAILOR" && role !== "VENDOR") {
                    return res.status(400).json({
                        message: "Invalid role provided. Please choose either 'TAILOR' or 'VENDOR'.",
                        status: 400,
                    });
                }
                const user = await prisma.user.findUnique({
                    where: { email: req.body.email },
                });
                if (user) {
                    return res.status(400).json({
                        message: "User already exists",
                        status: 400,
                    });
                }
                if (req.body.password !== req.body.confirmPassword) {
                    return res.status(400).json({
                        message: "Passwords do not match",
                        status: 400,
                    });
                }
                const password = Utils.hashPassword(req.body.password);
                const newUser = await prisma.user.create({
                    data: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        photo: req.file?.path || "", // Add the photo field
                        email: req.body.email,
                        password: password,
                        role: req.body.role || "TAILOR",
                    },
                });
                const actor = await prisma.actor.create({
                    data: {
                        idUser: newUser.id,
                        address: req.body.address,
                        bio: req.body.bio,
                        role: req.body.role,
                        credits: 50,
                        votes: 0,
                    },
                });
                Messenger.sendMail(newUser.email, newUser.firstname, "Welcome to our platform! Your account has been created successfully. You can now log in to your account.");
                Messenger.sendSms(newUser.phone, newUser.firstname, "Welcome to our platform! Your account has been created successfully. You can now log in to your account.");
                res.json({
                    message: ` ${role} created successfully`,
                    data: actor,
                    token: Utils.generateToken(newUser),
                    status: 200,
                });
            }
            catch (err) {
                res.status(500).json({
                    message: "Internal server error",
                    error: err.message,
                });
            }
        });
    };
    //get all actors
    static getActors = async (req, res) => {
        const actors = await prisma.actor.findMany();
        res.json({
            message: "Actors fetched successfully",
            data: actors,
            status: 200,
        });
    };
    static getActorById = async (req, res) => {
        const actor = await prisma.actor.findUnique({
            where: {
                id: Number(req.params.id),
            },
        });
        res.json({
            message: "Actor fetched successfully",
            data: actor,
            status: 200,
        });
    };
    //update actor
    static updateActor = async (req, res) => {
        try {
            const { id } = req.params;
            const validFields = [
                "idUser",
                "address",
                "bio",
                "credits",
                "vote",
                "role",
            ];
            const dataUpdate = {};
            for (const key in req.body) {
                if (validFields.includes(key)) {
                    dataUpdate[key] = req.body[key];
                }
            }
            if (Object.keys(dataUpdate).length == 0) {
                return res.status(400).json({
                    message: "No valid fields provided to update",
                    status: 400,
                });
            }
            const actor = await prisma.actor.update({
                where: {
                    id: Number(id),
                },
                data: dataUpdate,
            });
            if (!actor) {
                return res.status(404).json({
                    message: "actor not found",
                    status: 404,
                });
            }
            res.json({
                message: "actor updated successfully",
                data: actor,
                status: 200,
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message,
            });
        }
    };
    //delete actor
    static deleteActor = async (req, res) => {
        try {
            const { id } = req.params;
            const actor = await prisma.actor.delete({
                where: {
                    id: Number(id),
                },
            });
            if (!actor) {
                return res.status(404).json({
                    message: "Actor not found",
                    status: 404,
                });
            }
            res.json({
                message: "Actor deleted successfully",
                data: actor,
                status: 200,
            });
        }
        catch (err) {
            res.status(500).json({
                message: "Internal server error",
                error: err.message,
            });
        }
    };
    static async getActorsByUserId(req, res) {
        const userId = req.params.userId; // Ou req.params.id si tu utilises des paramètres d'URL
        try {
            // Logic pour récupérer les données de l'acteur par userId
            const actor = await prisma.actor.findUnique({ where: { idUser: parseInt(userId) },
                include: { user: true,
                    follow: {
                        include: {
                            user: true
                        }
                    },
                    posts: {
                        include: {
                            likes: true,
                            comments: true,
                            share: true,
                            notes: true
                        },
                    },
                    produits: {
                        include: {
                            notes: true,
                        },
                    },
                },
            }); // Exemple de requête
            if (!actor) {
                return res.status(404).json({ message: 'Aucun acteur trouvé', status: 404, data: null });
            }
            return res.json({ message: 'Acteur trouvé', status: 200, data: actor });
        }
        catch (error) {
            console.error('Erreur lors de la récupération de l\'acteur:', error);
            return res.status(500).json({ message: 'Erreur du serveur', status: 500, data: null });
        }
    }
}
