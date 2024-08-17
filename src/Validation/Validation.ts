import { z } from "zod";
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

    static validateProduit = z.object({
        libelle: z.string().min(1, "Libelle is required"),
        description: z.string().optional(), // Champ optionnel
        image: z.string().url("Image must be a valid URL"), // Validation d'URL pour l'image
        price: z.number().positive("Price must be a positive number"),
        qte: z.number().int().positive("Quantity must be a positive integer")
    });

    static validateCommande = z.object({
        idUser: z.number().min(1, "User ID is required"),
    });

    static validateCommandeProduit = z.object({
        idCommande: z.number().int().positive("Commande ID must be a positive integer"),
        idProduit: z.number().int().positive("Produit ID must be a positive integer"),
        qte: z.number().int().positive("Quantity must be a positive integer"),
    });



}

