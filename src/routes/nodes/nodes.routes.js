const express = require("express");
const router = express.Router();

const nodesController = require("../../controllers/nodes/nodes.controller");
const { validateDirector } = require("../../middlewares/validateStaff");

// Création d'un nouveau node
router.post('/', validateDirector, nodesController.create);

// Suppression d'un node
router.delete('/', validateDirector, nodesController.delete);

// Récuperation de tout les nodes
router.get('/', nodesController.findAll);

// Récuperation du status des nodes
router.get('/status', nodesController.findStatus);

// Récuperation d'un node par son id
router.get('/id/:id', nodesController.findById);

// Récuperation d'un node par son type
router.get('/type', nodesController.findByType);

// Mise à jour d'un node
router.put('/:id', validateDirector, nodesController.update);

module.exports = router;