const express = require("express");
const router = express.Router();

const supportCategoriesController = require("../../controllers/support/supportCategories.controller");
const { validateDirector, validateStaff } = require("../../middlewares/validateStaff");
const { validateToken } = require("../../middlewares/validateToken");

// Création d'une nouvelle catégorie
router.post('/', validateDirector, supportCategoriesController.create);

// Suppression d'une catégorie
router.delete('/', validateDirector, supportCategoriesController.delete);

// Récuperation de toutes les catégories
router.get('/', validateToken, supportCategoriesController.findAll);

// Récuperation de catégorie par id
router.get('/:id', validateStaff, supportCategoriesController.findById);

// Modification d'une catégorie
router.put('/:id', validateDirector, supportCategoriesController.update);

module.exports = router;