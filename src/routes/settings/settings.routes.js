const express = require("express");
const router = express.Router();

const settingsController = require("../../controllers/settings/settings.controller");
const { validateDirector } = require("../../middlewares/validateStaff");

/* Création d'un nouveau paramètre du site */
router.post('/create', validateDirector, settingsController.create);

/* Mode maintenance */
router.patch('/maintenance', validateDirector, settingsController.toggleMaintenance);
router.get('/maintenance', settingsController.getMaintenanceStatus);

module.exports = router;