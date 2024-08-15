import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class Utils {
    static generateToken(id: number) {
<<<<<<< HEAD
        return jwt.sign({id}, process.env.JWT_SECRET as string, {
=======
        return jwt.sign({id}, process.env.SECRET_KEY as string, {
>>>>>>> origin/oumar
            expiresIn: "1d",
        });
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

}