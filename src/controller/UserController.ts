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