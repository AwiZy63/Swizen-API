'use strict';

const SupportMessage = require("../../models/support/supportMessages.model");
const SupportTicket = require("../../models/support/supportTickets.model");
const Joi = require("joi");

const supportMessageSchema = Joi.object().keys({
    user_id: Joi.number().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().required().email({ minDomainSegments: 2 }),
    permission_level: Joi.number().required(),
    message: Joi.string().max(255).required(),
    ticket_id: Joi.number().required()
});

exports.create = async (req, res) => {
    try {
        const { userId, permission, firstName, lastName, email } = req.decoded;
        const data = req.body;
        req.body.user_id = userId;
        req.body.first_name = firstName;
        req.body.last_name = lastName;
        req.body.email = email;
        req.body.permission_level = permission;
        
        if (!data || !data.message || !data.ticket_id) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations nécessaires."
            }).status(400);
        }

        if (permission === 0) {
            const allowed = await SupportTicket.findOne({ where: { id: req.body.ticket_id, userId: userId } });

            if (!allowed) {
                const isExist = await SupportTicket.findOne({ where: { id: req.body.ticket_id } });

                if (isExist) {
                    return res.status(401).json({
                        error: true,
                        message: "Action interdite."
                    });
                }
                return res.status(404).json({
                    error: true,
                    message: "Le ticket est introuvable."
                });
            }
        }

        const result = supportMessageSchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }


        const isExist = await SupportTicket.findOne({ where: { id: req.body.ticket_id } });
        if (!isExist) {
            return res.status(404).json({
                error: true,
                message: "Le ticket est introuvable."
            });
        }

        /*
        const supportTicket = isExist;

        const ticketData = {
           isWaiting: permission === 0 ? 1 : 0,
           isAnswered: permission === 0 ? 0 : 1  
        }
        */
        const newSupportMessage = new SupportMessage(result.value);
        await newSupportMessage.save()
        //await supportTicket.update(ticketData);

        return res.json({
            success: true,
            message: 'Création du message effectué',
            ticketMessage: newSupportMessage.dataValues
        }).status(200);
    } catch (err) {
        console.error("support-message-create : " + err + " " + req.decoded);
        return res.json({
            error: true,
            message: "Création du message impossible."
        }).status(500);
    }
}

exports.findAllById = async (req, res) => {
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

                if (isExist) {
                    return res.status(401).json({
                        error: true,
                        message: "Action interdite."
                    });
                }
                return res.status(404).json({
                    error: true,
                    message: "Le ticket est introuvable."
                });
            }
        }

        const isExist = await SupportTicket.findOne({ where: { id: req.params.id } });

        if (!isExist) {
            return res.status(404).json({
                error: true,
                message: "Le ticket est introuvable."
            });
        }

        const supportMessages = await SupportMessage.findAll({ where: { ticket_id: req.params.id } });

        if (!supportMessages) {
            return res.status(404).json({
                error: true,
                message: "Aucun message n'a été trouvé dans ce ticket."
            });
        }

        return res.status(200).json({
            success: true,
            supportMessages
        });
    } catch (err) {
        console.error("support-messages-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation des messages impossible."
        }).status(500);
    }
}