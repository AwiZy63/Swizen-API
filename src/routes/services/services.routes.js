const express = require("express");
const router = express.Router();

const servicesController = require("../../controllers/services/services.controller");
const { validateToken } = require("../../middlewares/validateToken");

router.post('/order/create', validateToken, servicesController.createOrder);
router.post('/order/confirm', validateToken, servicesController.confirmOrder);

/* Service renew and check expiration */
router.post('/renew', validateToken, servicesController.renewService);
router.get('/expiration', validateToken, servicesController.getServiceExpiration);

module.exports = router;