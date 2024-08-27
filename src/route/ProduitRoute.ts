import { Router } from 'express';
import ProduitController from '../controller/ProduitController.js';
import Middleware from '../Middleware/Middleware.js';

const router = Router();

// Routes pour les produits
router.post('/', Middleware.auth, Middleware.isVendor, ProduitController.addProduit);
router.put('/:id', Middleware.auth, Middleware.isVendor, ProduitController.updateProduit);
router.get('/:id', Middleware.auth, ProduitController.findProduit);
router.get('/user/:idActor', Middleware.auth, ProduitController.findProduitUser);
router.post("/notes", Middleware.auth, ProduitController.noterProduit);

// Routes pour les commandes
router.post('/commandes', Middleware.auth, ProduitController.newCommande);
router.post('/commandes/produit', Middleware.auth, ProduitController.addCommandeProduit);
router.put('/commandes/:id/valider', Middleware.auth, ProduitController.validerCommande);
router.get('/commandes/user/:idUser', Middleware.auth, ProduitController.findCommandeUser);
router.get('/commandes/vendor/:idVendor', Middleware.auth, ProduitController.findCommandeVendor);
router.get('/commandes/produits/:idCommande', Middleware.auth, ProduitController.findProduitCommande);

export default router;