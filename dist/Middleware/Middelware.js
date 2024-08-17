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
            return res.status(401).json({ message: "Token not found" });
        }
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.SECRET_KEY);
                req.userId = decoded.id; // Assurez-vous que `userId` est défini dans le `req`
                next();
            }
            catch (error) {
                return res.status(401).json({ message: "Token not valid" });
            }
        }
        else {
            return res.status(401).json({ message: "Token not found" });
        }
    };
    static isTailor = async (req, res, next) => {
        const idUser = req.userId;
        if (!idUser) {
            return res.status(401).json({ message: "User ID is missing", data: null, status: false });
        }
        try {
            const user = await prisma.user.findUnique({ where: { id: idUser } });
            if (user?.role === "TAILOR") {
                next();
            }
            else {
                res.status(401).json({ message: "You are not a tailor" });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static isVendor = async (req, res, next) => {
        const idUser = req.userId;
        if (!idUser) {
            return res.status(401).json({ message: "User ID is missing", data: null, status: false });
        }
        try {
            const user = await prisma.user.findUnique({ where: { id: idUser } });
            if (user?.role === "VENDOR") {
                next();
            }
            else {
                res.status(401).json({ message: "You are not a vendor" });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
    static isActor = async (req, res, next) => {
        const idUser = req.userId;
        if (!idUser) {
            return res.status(401).json({ message: "User ID is missing", data: null, status: false });
        }
        try {
            const user = await prisma.user.findUnique({ where: { id: idUser } });
            if (user?.role === "TAILOR" || user?.role === "VENDOR") {
                next();
            }
            else {
                res.status(401).json({ message: "You are not an actor" });
            }
        }
        catch (error) {
            res.status(500).json({ message: error.message, data: null, status: false });
        }
    };
}
