import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default class Utils {
    static generateToken(user) {
        return jwt.sign({ id: user.id, email: user.email, role: user.role }, // Ajoute des informations utiles dans le payload
        process.env.SECRET_KEY, // Secret key
        {
            expiresIn: '1d', // Expiration du token
        });
    }
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    static comparePassword(password, hash) {
        return bcrypt.compareSync(password, hash);
    }
    static generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static generateRandomNumber(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static Code() {
        return Math.floor(1000 + Math.random() * 90000000000);
    }
}
