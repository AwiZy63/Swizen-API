const express = require("express");
const router = express.Router();

const productsTypeController = require("../../controllers/products/productTypes.controller");
const { validateDirector } = require("../../middlewares/validateStaff");

// Création d'un nouveau type de produit
router.post('/', validateDirector, productsTypeController.create);

// Suppression d'un type de produit
router.delete('/', validateDirector, productsTypeController.delete);

// Récuperation de tout les types de produit
router.get('/', productsTypeController.findAll);

// Récuperation d'un type de produit spécifique
router.get('/:id', productsTypeController.findById);

// Mise à jour d'un type de produit
router.put('/:id', validateDirector, productsTypeController.update);

module.exports = router;