import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class Middleware {
    static auth = (req, res, next) => {
        const entete = req.headers.authorization;
        let token;
        if (entete) {
            token = entete.split(" ")[1];
        }
        else {
            res.status(401).json({ message: "token not found" });
        }
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (decoded) {
                req.params.userId = decoded.id;
                next();
                return;
            }
            else {
                return res.status(401).json({ message: "token not valid" });
            }
        }
        else {
            return res.status(401).json({ message: "token not found" });
        }
    };
    static isTailor = async (req, res, next) => {
        const idUser = req.params.userId;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(idUser)
            }
        });
        if (user?.role === "TAILOR") {
            next();
        }
        else {
            res.status(401).json({ message: "you are not a tailor" });
        }
    };
    static isVendor = (req, res, next) => {
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
    };
    static isActor = (req, res, next) => {
        const idUser = req.params.userId;
        prisma.user.findUnique({
            where: {
                id: Number(idUser)
            }
        }).then((user) => {
            if (user?.role === "TAILOR" || user?.role === "VENDOR") {
                next();
            }
            else {
                res.status(401).json({ message: "you are not a Actor" });
            }
        });
    };
}
