'use strict';

const { panel, pteropanel } = require("../../../config/database.config");
const Nodeactyl = require("nodeactyl");
const { ServiceOrder } = require("../../models/services/services.model");
const Product = require("../../models/products/products.model");
const { Op } = require("sequelize");
const Joi = require("joi");
const User = require("../../models/users/users.model");
let newServer;
const ServerBuilder = Nodeactyl.ServerBuilder;

const serverSchema = Joi.object().keys({
    serverOwner: Joi.number().required(),
    serverOffer: Joi.string().max(255).required(),
    serverCpu: Joi.number().required(),
    serverRam: Joi.number().required(),
    serverDisk: Joi.number().required(),
    serverDatabase: Joi.number().required(),
    serverGameType: Joi.string().max(255).required()
});

const orderSchema = Joi.object().keys({
    user_id: Joi.number().required(),
    product_id: Joi.number().default(1),
    transaction_id: Joi.string().required(),
    status: Joi.string().default('PENDING')
});

exports.createOrder = async (req, res) => {
    try {
        const { userId } = req.decoded;
        const data = req.body;
        data.user_id = userId;
        console.log(data)
        if (!data || !data.user_id || !data.transaction_id) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner tous les champs necessaires."
            }).status(400);
        }

        const result = orderSchema.validate(data);

        if (result.error) {
            console.error(result.value + ' ' + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        /*const productExist = await Product.findOne({ where: { id: product_id } });

            if (!productExist) {
                return res.json({
                    error: true,
                    message: "Le produit n'existe pas."
                }).status(404);
            }
        */
        const newOrder = new ServiceOrder(result.value);
        await newOrder.save()

        return res.json({
            success: true,
            message: "La commande à bien été créée"
        }).status(200);
    } catch (error) {
        console.log('order-create-error', error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.confirmOrder = async (req, res) => {
    try {
        const { userId } = req.decoded;
        const data = req.body;
        data.user_id = userId;

        if (!data || !data.user_id || !data.transaction_id || !data.status) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner tous les champs necessaires."
            }).status(400);
        }

        const transaction = await ServiceOrder.findOne({ where: { [Op.and]: { transaction_id: data.transaction_id, user_id: data.user_id } } });

        if (!transaction) {
            return res.json({
                error: true,
                message: "Transaction invalide."
            }).status(500);
        }

        if (transaction && data.status === "COMPLETED") {
            const updateStatus = { status: "COMPLETED" }
            await transaction.update(updateStatus);

            return res.json({
                success: true,
                message: "Paiement accepté, vous allez être redirigé vers la page de vos services."
            });
        }

        return res.json({
            error: true,
            message: "Une erreur est survenue, veuillez contacter un membre du support sur notre discord : http://discord.swizen.online/"
        });
    } catch (error) {
        console.log('order-confirm-error', error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.renewService = async (req, res) => {
    try {
        const { userId, panelId } = req.decoded;
        const data = req.body;
        const serverId = data.server_uuid;
        const productName = data.product_name;
        const renewTime = data.renew_time;

        const user = await User.findOne({ where: { id: userId } });

        if (!data || !serverId || !renewTime || !productName) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner tous les champs necessaires."
            }).status(400);
        }

        if (!user) {
            return res.json({
                error: true,
                message: "L'utilisateur est introuvable."
            }).status(404);
        }

        const product = await Product.findOne({ where: { name: productName } });

        if (!product) {
            return res.json({
                error: true,
                message: "Le produit est introuvable."
            }).status(404);
        }

        const productPrice = (product.price * renewTime);

        pteropanel.execute(`SELECT exp_date, status FROM servers WHERE uuidShort='${serverId}' AND owner_id=${panelId}`, async (error, response) => {
            if (error) throw error;
            if (response && response.length === 0) {
                return res.json({
                    error: true,
                    message: "Le service est introuvable."
                }).status(404);
            }

            if (response[0].status && response[0].status === 'suspended') {
                return res.json({
                    error: {
                        status: true,
                        type: "server_suspended"
                    },
                    message: "Vous ne pouvez pas renouveler un service suspendu."
                }).status(401);
            }

            if (user.wallet < productPrice) {
                return res.json({
                    error: {
                        status: true,
                        type: "not_enough_money"
                    },
                    message: "Veuillez recharger votre portefeuille pour renouveler votre service."
                }).status(400);
            }

            let currentExpirationDate = new Date(response[0].exp_date);
            let newExpirationDate = new Date(currentExpirationDate.setMonth(currentExpirationDate.getMonth() + parseInt(renewTime)));
            const formattedExpDate = `${newExpirationDate.getFullYear()}-${newExpirationDate.getMonth() + 1}-${newExpirationDate.getDate()}`

            pteropanel.execute(`UPDATE servers SET exp_date='${formattedExpDate}' WHERE uuidShort='${serverId}'`, async (error, response) => {
                if (error) throw error;
                await user.update({ wallet: user.wallet - productPrice });

                return res.json({
                    success: true,
                    message: `Votre service à bien été renouveler ${renewTime === 1 ? "d'un mois." : `de ${renewTime} mois.` }`,
                    newExpirationDate
                }).status(200);
            })
        })


    } catch (error) {
        console.log("service-renew", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.getServiceExpiration = async (req, res) => {
    try {
        const { userId, permission, panelId } = req.decoded;
        const data = req.body;
        const serverId = data.server_uuid;
        const specificsPanelId = data.panel_id;

        if (!data || !serverId) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner tous les champs necessaires."
            }).status(400);
        }

        if (permission > 0 && !Number(specificsPanelId)) {
            return res.json({
                error: true,
                message: "Veuillez renseigner l'id d'un utilisateur."
            }).status(400);
        }

        if (permission === 0) {
            pteropanel.execute(`SELECT exp_date FROM servers WHERE uuidShort='${serverId}' AND owner_id=${panelId}`, (error, response) => {
                if (error) throw error;
                if (response && response.length === 0) {
                    return res.json({
                        error: true,
                        message: "Le service est introuvable."
                    }).status(404);
                }
                return res.json({
                    success: true,
                    response
                }).status(200);
            })
        }

        pteropanel.execute(`SELECT exp_date FROM servers WHERE uuidShort='${serverId}' AND owner_id=${specificsPanelId}`, (error, response) => {
            if (error) throw error;
            if (response && response.length === 0) {
                return res.json({
                    error: true,
                    message: "Le service est introuvable."
                }).status(404);
            }
            return res.json({
                success: true,
                response
            }).status(200);
        })
    } catch (error) {
        console.log("service-expiration-get", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}