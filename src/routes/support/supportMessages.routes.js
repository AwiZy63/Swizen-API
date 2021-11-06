const express = require("express");
const router = express.Router();

const supportMessagesController = require("../../controllers/support/supportMessages.controller");
const { validateToken } = require("../../middlewares/validateToken");

// Création d'un nouveau message de ticket
router.post('/', validateToken, supportMessagesController.create);

// Récuperation des messages via un id Ticket
router.get('/:id', validateToken, supportMessagesController.findAllById)

module.exports = router;