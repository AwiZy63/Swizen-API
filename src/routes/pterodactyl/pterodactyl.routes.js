const express = require("express");
const pterodactylController = require("../../controllers/pterodactyl/pterodactyl.controller");
const { validateToken } = require("../../middlewares/validateToken");
const router = express.Router();

router.get("/services", validateToken, pterodactylController.findAllServersByUserId);
router.post("/services/power", validateToken, pterodactylController.serverPowerActions);

module.exports = router;