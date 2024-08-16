import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export default class Middleware {

    static auth = (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (decoded) {
                next();
                req.params.userId = (decoded as any).id;
            }
            else {
                res.status(401).json({ message: "Unauthorized" });
            }
        }
        else {
            res.status(401).json({ message: "token not found" });
        }
    }

    static isTailor = (req: Request, res: Response, next: NextFunction) => {
        const idUser = req.params.userId;
        prisma.user.findUnique({
            where: {
                id: Number(idUser)
            }
        }).then((user) => {
            if (user?.role === "TAILOR") {
                next();
            }
            else {
                res.status(401).json({ message: "you are not a tailor" });
            }
        });
    }

    static isVendor = (req: Request, res: Response, next: NextFunction) => {
        const idUser = req.params.userId;
        prisma.user.findUnique({
            where: {
                id: Number(idUser)
            }
        }).then((user) => {
            if (user?.role === "VENDOR") {
                next();
            }
            else {
                res.status(401).json({ message: "you are not a vendor" });
            }
        });
    }
}