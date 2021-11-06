const express = require("express");
const router = express.Router();
const invoicesController = require("../../controllers/invoices/invoices.controller");
const { validateStaff } = require("../../middlewares/validateStaff");
const { validateToken } = require("../../middlewares/validateToken");

/* Récuperation de toutes les factures */
router.get("/", validateStaff, invoicesController.findAll);

/* Récuperation de toutes les factures via le userId */
router.get("/owned", validateToken, invoicesController.findByUserId);

/* Récuperation d'une facture par son id */
router.get("/:id", validateToken, invoicesController.findById);

module.exports = router;