'use strict';

const Node = require('../../models/nodes/nodes.model');
const checkNodeByName = require('../../utils/check-nodes.util');
const { Op } = require("sequelize")
const Joi = require("joi");

const nodeSchema = Joi.object().keys({
    name: Joi.string().max(255).required(),
    subdomain: Joi.string().max(255).required(),
    type: Joi.string().max(255)
})

exports.create = async (req, res) => {
    try {
        if (!req.body || !req.body.name || !req.body.subdomain) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        req.body.subdomain = req.body.subdomain.replace(" ", "");

        const result = nodeSchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        const node = await Node.findOne({ where: { [Op.or]: { name: result.value.name, subdomain: result.value.subdomain } } });

        if (node) {
            return res.json({
                error: true,
                message: "Le node existe déjà."
            }).status(400);
        }

        const newNode = new Node(result.value);
        await newNode.save();
        return res.json({
            success: true,
            message: 'Création du node effectué'
        }).status(200);
    } catch (err) {
        console.error("node-create : " + err);
        return res.json({
            error: true,
            message: "Création du node impossible."
        }).status(500);
    }
}

exports.delete = async (req, res) => {
    try {
        if (!req.body || !req.body.id) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const node = await Node.findOne({ where: { id: req.body.id } });

        if (!node) {
            return res.json({
                error: true,
                message: "Le node n°" + req.body.id + " est introuvable."
            }).status(404);
        }

        await node.destroy()
        return res.json({
            success: true,
            message: 'Suppression du node effectué'
        }).status(200);
    } catch (err) {
        console.error("node-delete : " + err);
        return res.json({
            error: true,
            message: "Suppression du node impossible."
        }).status(500);
    }
}

exports.findAll = async (req, res) => {
    try {
        const nodes = await Node.findAll();

        if (!nodes) {
            return res.json({
                error: true,
                message: "Aucun node n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            nodes
        }).status(200);
    } catch (err) {
        console.error("node-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation des node impossible."
        }).status(500);
    }
};

exports.findById = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id renseigné n'est pas un nombre."
            }).status(400);
        }

        const node = await Node.findOne({ where: { id: req.params.id } });

        if (!node) {
            return res.json({
                error: true,
                message: "Aucun node n'est disponible."
            }).status(404);
        }

        return res.status(200).json({
            success: true,
            node
        });
    } catch (err) {
        console.error("node-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation du node impossible."
        }).status(500);
    }
};

exports.findByType = async (req, res) => {
    try {
        if (!req.body.type) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const nodes = await Node.findAll({ where: { type: req.body.type } });

        if (!node) {
            return res.json({
                error: true,
                message: "Aucun node n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            nodes
        }).status(200);
    } catch (err) {
        console.error("node-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation des nodes impossible."
        }).status(500);
    }
};

exports.findStatus = async (req, res) => {
    try {
        const nodes = await Node.count();

        if (!nodes) {
            return res.json({
                success: true,
                data: [
                    {
                        "online": 0,
                        "offline": 0
                    }
                ]
            }).status(200);
        }

        const onlineNodes = await Node.count({ where: { status: 1 } });
        const offlineNodes = await Node.count({ where: { status: 0 } });
        return res.json({
            success: true,
            data: [
                {
                    "online": onlineNodes,
                    "offline": offlineNodes
                }
            ]
        }).status(200);
    } catch (err) {
        console.error("node-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation des nodes impossible."
        }).status(500);
    }
};

exports.update = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id renseigné n'est pas un nombre."
            }).status(400);
        }

        const node = await Node.findOne({ where: { id: req.params.id } });

        if (!node) {
            return res.json({
                error: true,
                message: "Aucun node n'est disponible."
            }).status(404);
        }

        const data = {
            name: req.body.name ? req.body.name : node.name,
            subdomain: req.body.subdomain ? req.body.subdomain : node.subdomain,
            type: req.body.type ? req.body.type : node.type
        }

        let error = {};

        if (req.body.name && req.body.name !== node.name) {

            const isExist = await Node.findOne({ where: { name: req.body.name } });

            if (isExist) {
                error.name = true;
            }
        }

        if (req.body.subdomain && req.body.subdomain !== node.subdomain) {
            const isExist = await Node.findOne({ where: { subdomain: req.body.subdomain } })

            if (isExist) {
                error.domain = true;
            }
        }

        if (error.name || error.domain) {
            let errorMessage;
            if (error.domain && error.name) {
                errorMessage = "Le nom et le sous domaine existent déjà."
            } else if (error.domain && !error.name) {
                errorMessage = "Le sous domaine existe déjà."
            } else if (!error.domain && error.name) {
                errorMessage = "Le nom existe déjà."
            }
            return res.json({
                error: true,
                message: errorMessage
            }).status(400);
        }

        await node.update(data);
        res.json({
            success: true,
            message: "Le node à bien été mis à jour"
        }).status(200);
    } catch (err) {
        console.error("node-update : " + err);
        return res.json({
            error: true,
            message: "Mise à jour du node impossible"
        }).status(500);
    }
};

// Check node status
exports.updateStatus = async (hosts) => {
    try {
        if (!hosts) {
            console.error('Les hôtes des nodes ne sont pas renseignées');
        } else {
            hosts.forEach(async (host) => {
                const name = host.name;
                const subdomain = host.subdomain;
                const node = await Node.findOne({ where: { name: name } });
                if (node) {
                    const online = await checkNodeByName(subdomain);
                    await node.update({ status: online ? 1 : 0 })
                } else {
                    console.error(`Le node ${name} est introuvable`);
                }
            });
        }
    } catch (error) {
        throw error;
    }
};

exports.getNodes = async () => {
    try {
        return Node.findAll();
    } catch (err) {
        throw err;
    }
}