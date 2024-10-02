import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';
const prisma = new PrismaClient();
import { Request, Response } from "express";
import Validation from '../Validation/Validation.js';
import Messenger from '../utils/Messenger.js'; 


export default class UserController {
    
    static createUser = async (req: Request, res: Response) => {
        const validationResult = Validation.validateUser.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        }
        try {
            const passwords = req.body.password;
            const confirmPassword = req.body.confirmPassword;
            if (passwords !== confirmPassword) {
                return res.status(400).json({ message: "Passwords do not match", status: 400 });
            }
            
        const password = Utils.hashPassword(req.body.password);
        const user = await prisma.user.create({
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                photo: req.body.photo,
                role: req.body.role,
                email: req.body.email,
                password: password
            }
        });
         Messenger.sendMail(user.email, user.firstname, 'Welcome to our platform! in Your account has been created successfully. You can now log  to your account.');
         Messenger.sendSms(user.phone, user.firstname, 'Welcome to our platform! in Your account has been created successfully. You can now log  to your account.');

        res.json({message: "User created successfully",
            data: user,
         status: 200
        });  
      }
      catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
      }
    }

    static getAllUsers = async (req: Request, res: Response) => {
        try {
        const users = await prisma.user.findMany();
        res.json({message: "Users retrieved successfully",
            data: users,
            status: 200
        });
    }
    catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
}

    static getUserById = async (req: Request, res: Response) => {
        try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({message: "User retrieved successfully",
            data: user,
            status: 200
        });
    }
    catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
}

    static updateUser = async (req: Request, res: Response) => {
        const validationResult = Validation.validateUser.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        }
        try {
        const user = await prisma.user.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        res.json({message: "User updated successfully",
            data: user,
            status: 200
        });
    }
    catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
}
 
    static login = async (req: Request, res: Response) => {
        const validationResult = Validation.validateLogin.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        }
        try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            res.json({message : "User not found"});
        }
        if(user && Utils.comparePassword(req.body.password, user.password)) {
            const token = Utils.generateToken(user.id);
            res.json({message: "User logged in successfully",
                token: token,
                status: 200
            });
        }
        else {
            res.json({message: "Email or password is incorrect",
                status: 401
            });
        }
    }
    catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
}

    static getUser = async (req: Request, res: Response) => {
      
        const idUser = req.params.userId;
        if (!idUser) {
            return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
        }
        try{
        const user = await prisma.user.findUnique({
            where: {
                id: Number(idUser)
            }
        });
        res.json({message: "User fetched successfully",
            data: user,
            status: 200
        });
    }
    catch (error: any) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
          });
    }
    }

    static addCredit = async (req: Request, res: Response) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            
            const { code } = req.body;
            
            // Assurez-vous que le code est une chaîne de caractères
            const codeString = code.toString();
            
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 400 });
            
            const mycode = await prisma.generateCode.findFirst({ where: { code: codeString } });
            if (!mycode) return res.status(404).json({ message: "Code not valid", data: null, status: 404 });
            if (mycode.status === 'USED') return res.status(400).json({ message: "Code already used", data: null, status: 400 });
    
            const tailor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
    
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
        } catch (error: any) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };

    static achatCode = async (req: Request, res: Response) => {
        try {
            // Supposons que l'ID de l'utilisateur connecté est disponible dans req.user.id
            const idUser = req.params.userId;
            
            const user = await prisma.user.findUnique({ where: { id: Number(idUser) } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
           
            const { montant } = req.body;
    
            if (montant < 100) return res.status(400).json({ message: "Montant invalide", data: null, status: 400 });
    
           
    
            const newCode = await prisma.generateCode.create({ data:{
                price: montant,
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
        } catch (error: any) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    }

    static getCredits = async (req: Request, res: Response) => {
        try {
            const idUser = req.params.userId;
            console.log('idUser', idUser); 
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const tailor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
            
            res.status(200).json({ message: "Credits added successfully", data: tailor, status: 200 });

        } catch (error: any) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };

    //become tailor
    static becomeTailor = async (req: Request, res: Response) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const tailor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
            const newTailor = await prisma.actor.create({
                data: {
                    idUser: parseInt(idUser),
                    credits: 50,
                    address: req.body.address,
                    bio: req.body.bio,
                    role: "TAILOR",
                    votes: 0
                },
                include: {
                    user: true
                }
                
            })
           await prisma.user.update({
                where: { id: parseInt(idUser) },
                data: {
                    role: "TAILOR"
                }
            })

            Messenger.sendMail(user.email, 'Tailor Digital', `Votre compte est maintenant un Tailor vous avez 50 credits`);
            Messenger.sendSms(user.phone, 'Tailor Digital', `Votre compte est maintenant un Tailor vous avez 50 credits`);
            res.status(200).json({ message: "Tailor created successfully", data: newTailor, status: 200 });
        } catch (error: any) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    };
    
    //become vendor
    static becomeVendor = async (req: Request, res: Response) => {
        try {
            const idUser = req.params.userId;
            if (!idUser) {  
                return res.status(400).json({ message: "Invalid user ID", data: null, status: 400 });
            }
            const user = await prisma.user.findUnique({ where: { id: parseInt(idUser) } });
            if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
            const vendor = await prisma.actor.findUnique({ where: { idUser: parseInt(idUser) } });
            if (!vendor) return res.status(404).json({ message: "Vendor not found", data: null, status: 404 });
            const newVendor = await prisma.actor.create({
                data: {
                    idUser: parseInt(idUser),
                    address: req.body.address,
                    bio: req.body.bio,
                    role: "VENDOR",
                    votes: 0
                },
                include: {
                    user: true
                }
                
            })
            const updateUser = await prisma.user.update({
                where: { id: parseInt(idUser) },
                data: {
                    role: "VENDOR"
                }
            })
            res.status(200).json({ message: "Vendor created successfully", data: newVendor, status: 200 });
        } catch (error: any) {
            res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
        }
    }


}



