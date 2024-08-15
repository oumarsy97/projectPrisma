var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { PrismaClient } from '@prisma/client';
import Utils from '../utils/Utils.js';
const prisma = new PrismaClient();
export default class UserController {
}
_a = UserController;
UserController.createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const password = Utils.hashPassword(req.body.password);
    const user = yield prisma.user.create({
        data: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            photo: req.body.photo,
            email: req.body.email,
            password: password
        }
    });
    res.json({ message: "User created successfully",
        data: user,
        status: 200
    });
});
UserController.updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: {
            id: Number(req.params.id)
        },
        data: req.body
    });
    res.json({ message: "User updated successfully",
        data: user,
        status: 200
    });
});
UserController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email: req.body.email
        }
    });
    if (user && Utils.comparePassword(req.body.password, user.password)) {
        const token = Utils.generateToken(user.id);
        res.json({ message: "User logged in successfully",
            token: token,
            status: 200
        });
    }
    else {
        res.json({ message: "Email or password is incorrect",
            status: 401
        });
    }
});
UserController.getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            id: Number(req.params.id)
        }
    });
    res.json({ message: "User fetched successfully",
        data: user,
        status: 200
    });
});
