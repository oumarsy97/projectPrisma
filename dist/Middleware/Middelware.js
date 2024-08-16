import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
class Middleware {
}
Middleware.auth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
            next();
            req.params.userId = decoded.id;
        }
        else {
            res.status(401).json({ message: "Unauthorized" });
        }
    }
    else {
        res.status(401).json({ message: "token not found" });
    }
};
Middleware.isTailor = (req, res, next) => {
    const idUser = req.params.userId;
    prisma.user.findUnique({
        where: {
            id: Number(idUser)
        }
    }).then((user) => {
        if ((user === null || user === void 0 ? void 0 : user.role) === "TAILOR") {
            next();
        }
        else {
            res.status(401).json({ message: "you are not a tailor" });
        }
    });
};
Middleware.isVendor = (req, res, next) => {
    const idUser = req.params.userId;
    prisma.user.findUnique({
        where: {
            id: Number(idUser)
        }
    }).then((user) => {
        if ((user === null || user === void 0 ? void 0 : user.role) === "VENDOR") {
            next();
        }
        else {
            res.status(401).json({ message: "you are not a vendor" });
        }
    });
};
export default Middleware;
