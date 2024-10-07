import VenteController from "../controller/VenteController.js";
import Middleware from "../Middleware/Middleware.js";
import express from "express";
const router = express.Router();
router.get("/myventes/", Middleware.auth, VenteController.getmyVentes);
router.post("/create/", Middleware.auth, Middleware.isVendor, VenteController.createVente);
router.get("/myventes/:idProduit", Middleware.auth, VenteController.getVenteByProduit);
export default router;
