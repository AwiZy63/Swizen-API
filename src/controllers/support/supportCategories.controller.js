'use strict';

const Joi = require("joi");
const SupportCategory = require("../../models/support/supportCategories.model");

const supportCategorySchema = Joi.object().keys({
    name: Joi.string().max(255).required()
})

exports.create = async (req, res) => {
    try {
        if (!req.body || !req.body.name) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const result = supportCategorySchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        const supportCategory = await SupportCategory.findOne({ where: { name: result.value.name } });

        if (supportCategory) {
            return res.json({
                error: true,
                message: "La catégorie de support existe déjà."
            }).status(400);
        }

        const newSupportCategory = new SupportCategory(result.value);
        await newSupportCategory.save();
        return res.json({
            success: true,
            message: 'Création de la catégorie de support effectué'
        }).status(200);
    } catch (err) {
        console.error("support-category-create : " + err);
        return res.json({
            error: true,
            message: "Création de la catégorie de support impossible."
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

        const supportCategory = await SupportCategory.findOne({ where: { id: req.body.id } });

        if (!supportCategory) {
            return res.json({
                error: true,
                message: "La catégorie de support n°" + req.body.id + " est introuvable."
            }).status(404);
        }

        await supportCategory.destroy()
        return res.json({
            success: true,
            message: 'Suppression de la catégorie de support effectuée'
        }).status(200);
    } catch (err) {
        console.error("support-category-delete : " + err);
        return res.json({
            error: true,
            message: "Suppression de la catégorie de support impossible."
        }).status(500);
    }
}

exports.findAll = async (req, res) => {
    try {
        const supportCategories = await SupportCategory.findAll();

        if (!supportCategories) {
            return res.json({
                error: true,
                message: "Aucune catégorie n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            supportCategories
        }).status(200);
    } catch (err) {
        console.error("support-categories-get : " + err);
        return res.json({
            error: true,
            message: "Récupération des catégories de support impossible."
        }).status(500);
    }
}

exports.findById = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const supportCategory = await SupportCategory.findOne({ where: { id: req.params.id } });

        if (!supportCategory) {
            return res.json({
                error: true,
                message: "La catégorie de support n'existe pas."
            }).status(404);
        }
        
        return res.json({
            success: true,
            supportCategory
        }).status(200);

    } catch (err) {
        console.error("support-categorie-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation de la catégorie de support impossible."
        }).status(500);
    }
}

exports.update = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const supportCategory = await SupportCategory.findOne({ where: { id: req.params.id } });

        if (!supportCategory) {
            return res.json({
                error: true,
                message: "La catégorie de support n'existe pas."
            }).status(404);
        }

        const data = {
            name: req.body.name ? req.body.name : supportCategory.name
        };

        if (req.body.name && req.body.name !== supportCategory.name) {
            const isExist = await SupportCategory.findOne({ where: { name: req.body.name } })

            if (isExist) {
                return res.json({
                    error: true,
                    message: "Le nom existe déjà."
                }).status(400);
            }
        }

        await supportCategory.update(data);
        return res.json({
            success: true,
            message: "La catégorie a bien été mise à jour."
        }).status(200);
    } catch (err) {
        console.error("support-categories-update : " + err);
        return res.json({
            error: true,
            message: "Récuperation de la catégorie de support impossible."
        }).status(500);
    }
}