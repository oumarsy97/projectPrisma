import { Router } from 'express';
import ProduitController from '../controller/ProduitController.js';
import Middleware from '../Middleware/Middleware.js';

const router = Router();

// Routes pour les produits
router.post('/', Middleware.auth, Middleware.isVendor, ProduitController.addProduit);
router.get('/', Middleware.auth, Middleware.isVendor, ProduitController.getProduit);
router.put('/:id', Middleware.auth, Middleware.isVendor, ProduitController.updateProduit);
router.get('/:id', Middleware.auth, ProduitController.findProduit);
router.get('/user/:idUser', Middleware.auth, ProduitController.findProduitUser);

// Routes pour les commandes
router.post('/commandes', Middleware.auth, ProduitController.newCommande);
router.post('/commandes/produit', Middleware.auth, ProduitController.addCommandeProduit);
router.put('/commandes/:id/valider', Middleware.auth, Middleware.isVendor, ProduitController.validerCommande);
router.put('/commandes/:id/annuler', Middleware.auth, Middleware.isVendor, ProduitController.annulerCommande);
router.get('/commandes/user/:idUser', Middleware.auth, ProduitController.findCommandeUser);
router.get('/commandes/vendor/:idVendor', Middleware.auth, ProduitController.findCommandeVendor);
router.get('/commandes/produits/:idCommande', Middleware.auth, ProduitController.findProduitCommande);
//noter
router.post("/notes", Middleware.auth, ProduitController.noterProduit);

export default router;