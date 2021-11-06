const express = require("express");
const router = express.Router();

const productsController = require("../../controllers/products/products.controller");
const { validateDirector } = require("../../middlewares/validateStaff");

// Création d'un nouveau produit
router.post('/', validateDirector, productsController.create);

// Suppression d'un produit
router.delete('/', validateDirector, productsController.delete);

// Récuperation de tout les produits
router.get('/', productsController.findAll);

// Récuperation d'un produit
router.get('/:id', productsController.findById);

// Mise à jour d'un produit
router.put('/:id', validateDirector, productsController.update);

module.exports = router;