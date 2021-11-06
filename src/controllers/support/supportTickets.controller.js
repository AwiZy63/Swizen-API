'use strict';

const SupportTicket = require("../../models/support/supportTickets.model");
const SupportMessage = require("../../models/support/supportMessages.model");
const Joi = require("joi");
const { findServerById } = require("../pterodactyl/pterodactyl.controller");
const { pteropanel, clientPanel } = require("../../../config/database.config");

const supportTicketSchema = Joi.object().keys({
    subject: Joi.string().max(255).required(),
    service: Joi.string().max(255).default(null),
    category: Joi.string().max(255).required(),
    is_closed: Joi.number().default(0),
    is_waiting: Joi.number().default(1),
    is_answered: Joi.string().default(0),
    user_id: Joi.number().required(),
    message: Joi.string().max(1280).required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
});

exports.create = async (req, res) => {
    try {
        const { userId, permission, firstName, lastName, email } = req.decoded;

        req.body.user_id = userId;
        req.body.email = email;
        const data = req.body;

        if (!data || !data.subject || !data.category || !data.message) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations nécessaires."
            }).status(400);
        }

        const result = supportTicketSchema.validate(data);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        const newSupportTicket = new SupportTicket(result.value);
        await newSupportTicket.save().then(async (response) => {
            const ticketMessage = {
                user_id: result.value.userId,
                first_name: firstName,
                last_name: lastName,
                email: result.value.email,
                permission_level: permission,
                message: result.value.message,
                ticketId: response.dataValues.id,
            };

            const newSupportMessage = new SupportMessage(ticketMessage);
            await newSupportMessage.save()
        })

        return res.json({
            success: true,
            message: 'Création du ticket effectué',
            ticketData: newSupportTicket.dataValues,
            ticketId: newSupportTicket.dataValues.id
        }).status(200);
    } catch (err) {
        console.error("support-ticket-create : " + err);
        return res.json({
            error: true,
            message: "Création du ticket support impossible."
        }).status(500);
    }
}

exports.setClosed = async (req, res) => {
    try {
        const { userId, permission } = req.decoded;

        if (!req.body || !req.body.id) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            });
        }

        const supportTicket = await SupportTicket.findOne({ where: { id: req.body.id } });

        const allowed = await SupportTicket.findOne({ where: { id: req.body.id, user_id: userId } });

        if (permission === 0) {
            if (!allowed) {
                if (!supportTicket) {
                    return res.json({
                        error: true,
                        message: "Le ticket est introuvable."
                    }).status(404);
                }
                return res.status(401).json({
                    error: true,
                    message: "Action interdite."
                });
            }
            if (supportTicket && supportTicket.is_closed === 1) {
                await supportTicket.update(data);
                return res.json({
                    success: true,
                    message: "Vous ne pouvez pas réouvrir un ticket fermé."
                }).status(401);
            }

            const data = {
                is_closed: 1
            };

            await supportTicket.update(data);
            return res.json({
                success: true,
                message: "Le ticket est désormais fermé."
            }).status(200);
        }

        if (!supportTicket) {
            return res.json({
                error: true,
                message: "Le ticket est introuvable."
            }).status(404);
        }

        const data = {
            is_closed: supportTicket.is_closed === 1 ? 0 : 1
        };

        if (supportTicket && supportTicket.is_closed === 1) {
            await supportTicket.update(data);
            return res.json({
                success: true,
                message: "Le ticket est désormais ouvert."
            }).status(200);
        }

        await supportTicket.update(data);
        return res.json({
            success: true,
            message: "Le ticket est désormais fermé."
        }).status(200);
    } catch (err) {
        console.error("support-ticket-close : " + err);
        return res.json({
            error: true,
            message: "Fermeture du ticket support impossible."
        }).status(500);
    }
}

exports.findAll = async (req, res) => {
    try {

        const supportTickets = await SupportTicket.findAll();

        if (!supportTickets) {
            return res.json({
                error: true,
                message: "Aucun ticket n'est disponible."
            }).status(400);
        }

        return res.json({
            success: true,
            supportTickets
        }).status(200);
    } catch (err) {
        console.error(error)
        return res.json({
            error: true,
            message: "Récuperation des tickets support impossible."
        }).status(500);
    }
}

exports.findAllById = async (req, res) => {
    try {
        const { userId } = req.decoded;

        const supportTickets = await SupportTicket.findAll({ where: { user_id: userId } });

        if (!supportTickets) {
            return res.status(404).json({
                error: true,
                message: "Aucun ticket support n'est disponible."
            });
        }

        return res.status(200).json({
            success: true,
            supportTickets
        });
    } catch (err) {
        console.error(error)
        return res.json({
            error: true,
            message: "Récuperation des tickets support impossible."
        })
    }
}

exports.findById = async (req, res) => {
    try {
        const { userId, permission } = req.decoded;

        if (!Number(req.params.id)) {
            return res.status(400).json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            });
        }

        if (permission === 0) {
            const allowed = await SupportTicket.findOne({ where: { id: req.params.id, user_id: userId } });

            if (!allowed) {
                const isExist = await SupportTicket.findOne({ where: { id: req.params.id } });

                if (!isExist) {
                    return res.status(404).json({
                        error: true,
                        message: "Le ticket n'existe pas."
                    });
                }
                return res.status(401).json({
                    error: true,
                    message: "Action interdite."
                });
            }

            const supportTicket = allowed;

            let serviceData;
            if (supportTicket.service && supportTicket.service.length > 0) {
                serviceData = await clientPanel.getServerDetails(supportTicket.service)
            }

            return res.status(200).json({
                success: true,
                supportTicket,
                serviceData
            });
        }

        const supportTicket = await SupportTicket.findOne({ where: { id: req.params.id } });

        let serviceData;
        if (supportTicket.service && supportTicket.service.length > 0) {
            serviceData = await clientPanel.getServerDetails(supportTicket.service)
        }

        if (!supportTicket) {
            return res.status(404).json({
                error: true,
                message: "Le ticket n'existe pas."
            });
        }

        const data = {
            is_waiting: 0
        }

        /*if (supportTicket.is_waiting === 1) {
            await supportTicket.update(data);
        }*/

        return res.status(200).json({
            success: true,
            supportTicket,
            serviceData
        });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            error: true,
            message: "Récuperation du ticket support impossible."
        });
    }
}