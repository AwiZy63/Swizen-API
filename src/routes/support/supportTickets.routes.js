const express = require("express");
const router = express.Router();

const supportTicketsController = require("../../controllers/support/supportTickets.controller");
const { validateStaff } = require("../../middlewares/validateStaff");
const { validateToken } = require("../../middlewares/validateToken");

// Création d'un nouveau ticket
router.post('/', validateToken, supportTicketsController.create);

// Fermeture / Ouverture d'un ticket
router.put('/', validateStaff, supportTicketsController.setClosed);

// Récuperation de tous les tickets
router.get('/all', validateStaff, supportTicketsController.findAll);

// Récuperation de ticket par id
router.get('/:id', validateToken, supportTicketsController.findById);

// Récuperation de ticket par userId
router.get('/', validateToken, supportTicketsController.findAllById);

module.exports = router;