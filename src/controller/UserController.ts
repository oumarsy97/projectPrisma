import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';

const prisma = new PrismaClient();
import { Request, Response } from "express";
import Validation from '../Validation/Validation.js';


export default class UserController {
    
    static createUser = async (req: Request, res: Response) => {
        const password = Utils.hashPassword(req.body.password);
        const validationResult = Validation.validateUser.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({message: validationResult.error.message, status: 400});
        }
        try {
        const user = await prisma.user.create({
            data: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                phone: req.body.phone,
                photo: req.body.photo,
                email: req.body.email,
                password: password
            }
        });

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

}
import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';
import { Request, Response } from "express";
import Validation from '../Validation/Validation.js';
import Messenger from '../utils/Messenger.js';

const prisma = new PrismaClient();

export default class UserController {
    static createUser = async (req: Request, res: Response) => {
        const password = Utils.hashPassword(req.body.password);
        const validationResult = Validation.validateUser.safeParse(req.body);
        if(!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const user = await prisma.user.create({
                data: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    phone: req.body.phone,
                    photo: req.body.photo,
                    email: req.body.email,
                    password: password
                }
            });

            res.json({ message: "User created successfully", data: user, status: 200 });  
        } catch (error: any) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    static updateUser = async (req: Request, res: Response) => {
        const validationResult = Validation.validateUser.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: validationResult.error.message, status: 400 });
        }
        try {
            const user = await prisma.user.update({
                where: { id: Number(req.params.id) },
                data: req.body
            });
            res.json({ message: "User updated successfully", data: user, status: 200 });
        } catch (error: any) {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    static login = async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({ where: { email: req.body.email } });
        if (user && Utils.comparePassword(req.body.password, user.password)) {
            const token = Utils.generateToken(user.id);
            res.json({ message: "User logged in successfully", token: token, status: 200 });
        } else {
            res.json({ message: "Email or password is incorrect", status: 401 });
        }
    }

    static getUser = async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) } });
        res.json({ message: "User fetched successfully", data: user, status: 200 });
    }

    static addCredit = async (req: Request, res: Response) => {
      try {
          const idUser = (req as any).userId;
          const { code } = req.body;
          
          const user = await prisma.user.findUnique({ where: { id: Number(idUser) } });
          if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });
          
          const mycode = await prisma.generateCode.findUnique({ where: { id: idUser } });          if (!mycode) return res.status(404).json({ message: "Code not valid", data: null, status: 404 });
          if (mycode.status === 'USED') return res.status(400).json({ message: "Code already used", data: null, status: 400 });
          
          const tailor = await prisma.actor.findUnique({ where: { idUser: Number(idUser) } });
          if (!tailor) return res.status(404).json({ message: "Tailor not found", data: null, status: 404 });
          
          const updatedTailor = await prisma.actor.update({
              where: { idUser: Number(idUser) },
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
        const idUser = (req as any).userId;
        const user = await prisma.user.findUnique({ where: { id: Number(idUser) } });
        if (!user) return res.status(404).json({ message: "User not found", data: null, status: 404 });

        const { montant, modePaiement } = req.body;

        if (montant < 100) return res.status(400).json({ message: "Montant invalide", data: null, status: 400 });

        // Changer 'Utils.Code()' pour générer une chaîne de caractères
        const newGenerateCode = {
            price: montant,  // Vérifiez si 'price' est correct dans votre modèle Prisma
            modePaiement: modePaiement,
            code: Utils.Code().toString(),  // Assurez-vous que c'est bien une chaîne
            credit: montant / 100  // Vérifiez si 'credit' est correct dans votre modèle Prisma
        };

        const newCode = await prisma.generateCode.create({ data: newGenerateCode });

        res.status(200).json({ message: "Code created successfully", data: newCode, status: 200 });

        const recu = `Recu<br>Montant : ${newCode.price}<br>Code : ${newCode.code}<br>Credits : ${newCode.credit}<br>Date : ${newCode.createdAt}<br>expire dans 7 jours`;        
        
        // Envoi du SMS et email via Messenger
        await Messenger.sendSms(user.phone, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
        await Messenger.sendMail(user.email, 'Tailor Digital', `Votre code de paiement est : ${recu}`);
    } catch (error: any) {
        res.status(500).json({ message: error.message || "An error occurred", data: null, status: 500 });
    }
};

}
