import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';
const prisma = new PrismaClient();
import Validation from '../Validation/Validation.js';
import Messenger from '../utils/Messenger.js';
import upload from '../config/multerConfig.js';
export default class UserController {
    static createUser = async (req, res) => {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ "message": "Error uploading file", "status": 400 });
            }
            // console.log(req.body);
            //   const validationResult = Validation.validateUser.safeParse(req.body);
            //   if (!validationResult.success) {
            //     return res.status(400).json({ message: validationResult.error.message, status: 400 });
            //   }
            try {
                if (req.body.password !== req.body.confirmPassword) {
                    return res.status(400).json({ message: "Passwords do not match", status: 400 });
                }
                const password = Utils.hashPassword(req.body.password);
                const user = await prisma.user.create({
                    data: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        photo: req.file?.path || "", // Add the photo field
                        role: 'USER',
                        email: req.body.email,
                        password: password,
                        genre: req.body.genre,
                    }
                });
                Messenger.sendMail(user.email, user.firstname, "Welcome to our platform! Your account has been created successfully. You can now log in to your account.");
                Messenger.sendSms(user.phone, user.firstname, "Welcome to our platform! Your account has been created successfully. You can now log in to your account.");
                const token = Utils.generateToken(user);
                res.json({
                    message: "User created successfully",
                    data: user,
                    token: token,
                    status: 200,
                });
            }
            catch (error) {
                res.status(500).json({
                    message: "Internal server error",
                    status: 500,
                    data: null,
                });
            }
        });
    };
    static getAllUsers = async (req, res) => {
        try {
            const users = await prisma.user.findMany();
            res.json({ message: "Users retrieved successfully",
                data: users,
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
    static getUserById = async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(req.params.id)
                },
                include: {
                    actor: {
                        include: {
                            follow: true,
                            posts: {
                                include: {
                                    likes: true,
                                    comments: true,
                                    share: true
                                },
                            },
                            produits: true,
                        }
                    },
                }
            });
            res.json({ message: "User retrieved successfully",
                data: user,
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
    static updateUser = async (req, res) => {
        const validationResult = Validation.validateUser.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const user = await prisma.user.update({
                where: {
                    id: Number(req.params.id)
                },
                data: req.body
            });
            res.json({ message: "User updated successfully",
                data: user,
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
    static login = async (req, res) => {
        const validationResult = Validation.validateLogin.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }
            });
            if (!user) {
                res.json({ message: "User not found", status: 404, data: null });
                return;
            }
            if (user && Utils.comparePassword(req.body.password, user.password)) {
                const token = Utils.generateToken(user);
                return res.status(200).json({ message: "User logged in successfully",
                    token: token,
                    status: 200
                });
            }
            else {
                return res.status(401).json({ message: "Email or password is incorrect",
                    status: 401
                });
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    };
    static getUser = async (req, res) => {
        const idUser = req.params.userId;
        if (!idUser) {
            res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            return;
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: Number(idUser)
                },
                include: {
                    follow: true,
                    reposts: true,
                    report: true,
                    favoris: {
                        include: {
                            post: true
                        }
                    }
                }
            });
            res.json({ message: "User fetched successfully",
                data: user,
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
    static addCredit = async (req, res) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const { code } = req.body;
            // Assurez-vous que le code est une chaîne de caractères
            const codeString = code.toString();
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user)
                return res.status(404).json({ message: "User not found", data: null, status: 400 });
            const mycode = await prisma.generateCode.findFirst({ where: { code: codeString } });
            if (!mycode)
                return res.status(404).json({ message: "Code not valid", data: null, status: 404 });
            if (mycode.status === 'USED')
                return res.status(400).json({ message: "Code already used", data: null, status: 400 });
            const tailor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!tailor)
                return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
            const updatedTailor = await prisma.actor.update({
                where: { idUser: parseInt(idUser) },
                data: {
                    credits: tailor.credits + mycode.credit
                }
            });
            await prisma.generateCode.update({
                where: { id: mycode.id },
                data: { status: 'USED' }
            });
            res.status(200).json({ message: "Credits added successfully", data: updatedTailor, status: 200 });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    static achatCode = async (req, res) => {
        try {
            // Supposons que l'ID de l'utilisateur connecté est disponible dans req.user.id
            const idUser = req.params.userId;
            const user = await prisma.user.findUnique({ where: { id: Number(idUser) } });
            if (!user)
                return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const actor = await prisma.actor.findUnique({ where: { idUser: Number(idUser) } });
            if (!actor)
                return res.status(404).json({ message: "Actor not found", data: null, status: 404 });
            const { montant } = req.body;
            if (montant < 100)
                return res.status(400).json({ message: "Montant invalide", data: null, status: 400 });
            const newCode = await prisma.generateCode.create({ data: {
                    price: +montant,
                    code: Utils.generateRandomNumber(12),
                    credit: montant / 100,
                }
            });
            const recu = `Recu Montant : ${newCode.price} Code : ${newCode.code}Credits : ${newCode.credit} Date : ${newCode.createdAt} expire dans 7 jours`;
            // Envoi du SMS et email via Messenger
            if (user.phone) {
                await Messenger.sendSms(user.phone, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
            }
            if (user.email) {
                await Messenger.sendMail(user.email, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
            }
            // Ne renvoyez pas les informations sensibles dans la réponse
            res.status(200).json({
                message: "Code created successfully",
                data: newCode,
                status: 200
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    static getCredits = async (req, res) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user)
                return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const tailor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!tailor)
                return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
            res.status(200).json({ message: "Credits added successfully", data: tailor, status: 200 });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    //become tailor
    static becomeTailor = async (req, res) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user)
                return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const newTailor = await prisma.actor.create({
                data: {
                    idUser: parseInt(idUser),
                    credits: 50,
                    address: req.body.address,
                    bio: req.body.bio,
                    role: "TAILOR",
                    votes: 0
                },
                include: { user: true,
                    follow: true,
                    posts: {
                        include: {
                            likes: true,
                            comments: true,
                            share: true
                        },
                    },
                    produits: {
                        include: {
                            notes: true,
                        },
                    },
                },
            });
            await prisma.user.update({
                where: { id: parseInt(idUser) },
                data: {
                    role: "TAILOR"
                }
            });
            Messenger.sendMail(user.email, 'Tailor Digital', `Votre compte est maintenant un Tailor vous avez 50 credits`);
            Messenger.sendSms(user.phone, 'Tailor Digital', `Votre compte est maintenant un Tailor vous avez 50 credits`);
            res.status(200).json({ message: "Tailor created successfully", data: newTailor, status: 200 });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    //become vendor
    static becomeVendor = async (req, res) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user)
                return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const newVendor = await prisma.actor.create({
                data: {
                    idUser: parseInt(idUser),
                    address: req.body.address,
                    bio: req.body.bio,
                    role: "VENDOR",
                    votes: 0
                },
                include: { user: true,
                    follow: true,
                    posts: {
                        include: {
                            likes: true,
                            comments: true,
                            share: true
                        },
                    },
                    produits: {
                        include: {
                            notes: true,
                        },
                    },
                },
            });
            const updateUser = await prisma.user.update({
                where: { id: parseInt(idUser) },
                data: {
                    role: "VENDOR"
                }
            });
            res.status(200).json({ message: "Vendor created successfully", data: newVendor, status: 200 });
        }
        catch (error) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    static search = async (req, res) => {
        try {
            const name = req.params.name;
            // Vérifier si un nom a été fourni
            if (!name) {
                return res.status(400).json({ message: "Invalid name", data: null, status: 400 });
            }
            // Recherche progressive sur plusieurs champs (firstname, lastname, email, phone)
            const result = await prisma.user.findMany({
                where: {
                    OR: [
                        { firstname: { contains: name, mode: 'insensitive' } },
                        { lastname: { contains: name, mode: 'insensitive' } },
                        { email: { contains: name, mode: 'insensitive' } },
                        { phone: { contains: name } }
                    ]
                },
                include: {
                    actor: true,
                    follow: true,
                    Notes: true
                }
            });
            // Réponse avec les résultats de la recherche
            return res.status(200).json({ message: "Search results", data: result, status: 200 });
        }
        catch (error) {
            // Gérer les erreurs
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error", data: null, status: 500 });
        }
    };
}
