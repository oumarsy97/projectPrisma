import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export default class Utils {
    static generateToken(id) {
        return jwt.sign({ id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
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
}
