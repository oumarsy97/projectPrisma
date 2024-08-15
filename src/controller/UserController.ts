import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';

const prisma = new PrismaClient();
import { Request, Response } from "express";


export default class UserController {
    
    static createUser = async (req: Request, res: Response) => {
        const password = Utils.hashPassword(req.body.password);
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
      };

    static updateUser = async (req: Request, res: Response) => {
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

    static login = async (req: Request, res: Response) => {
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

    static getUser = async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(req.params.id)
            }
        });
        res.json({message: "User fetched successfully",
            data: user,
            status: 200
        });
    }

}