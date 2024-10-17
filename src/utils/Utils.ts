import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();
 
export default class Utils {
    static generateToken(user: User) {
       
        return jwt.sign(
            { id: user.id, email: user.email, role: user.role }, // Ajoute des informations utiles dans le payload
            process.env.SECRET_KEY as string, // Secret key
            {
                expiresIn: '1d', // Expiration du token
            }
        );
    }  

    static hashPassword(password: string) {
        return bcrypt.hashSync(password, 10);
    }

    static comparePassword(password: string, hash: string) {
        return bcrypt.compareSync(password, hash);
    }

    static generateRandomString(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static generateRandomNumber(length: number) {
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