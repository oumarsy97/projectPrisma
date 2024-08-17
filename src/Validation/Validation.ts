import {z} from "zod";
import Utils from "../utils/Utils";

export default class Validation {
      
    static validateUser = z.object({
        firstname: z.string().min(1, "First name is required"),
        lastname: z.string().min(1, "Last name is required"),
        phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
        photo: z.string(),  // Optionnel, à ajuster selon vos besoins
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
      });

    static validateLogin = z.object({
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
    });

   



}

