'use strict';

const ProductType = require('../../models/products/productsTypes.model');
const Joi = require("joi");

const productTypeSchema = Joi.object().keys({
    name: Joi.string().max(255).required(),
    nest_id: Joi.number().required(),
    egg_id: Joi.number().required()
})

exports.create = async (req, res) => {
    try {
        if (!req.body || !req.body.name || !req.body.nest_id || !req.body.egg_id) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const result = productTypeSchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        const productType = await ProductType.findOne({ where: { name: result.value.name } });

        if (productType) {
            return res.json({
                error: true,
                message: "Le type de produit existe déjà."
            }).status(400);
        }

        const newProductType = new ProductType(result.value);
        await newProductType.save();
        return res.json({
            success: true,
            message: 'Création du produit effectué'
        }).status(200);
    } catch (err) {
        console.error("product-type-create : " + err);
        return res.json({
            error: true,
            message: "Création du type de produit impossible."
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

        const productType = await ProductType.findOne({ where: { id: req.body.id } });

        if (!productType) {
            return res.json({
                error: true,
                message: "Le type de produit n°" + req.body.id + " est introuvable."
            }).status(404);
        }

        await productType.destroy()
        return res.json({
            success: true,
            message: 'Suppression du produit effectué'
        }).status(200);
    } catch (err) {
        console.error("product-type-delete : " + err);
        return res.json({
            error: true,
            message: "Suppression du type de produit impossible."
        }).status(500);
    }
}

exports.findAll = async (req, res) => {
    try {
        const productsTypes = await ProductType.findAll();

        if (!productsTypes) {
            return res.json({
                error: true,
                message: "Aucun type de produit n'est disponible."
            }).status(400);
        }

        return res.json({
            success: true,
            productsTypes
        }).status(200);
    } catch (err) {
        console.error("product-type-get : " + err);
        return res.json({
            error: true,
            message: "Récupération des types de produits impossible."
        }).status(500);
    }
}

exports.findById = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id est renseigné n'est pas un nombre."
            }).status(400);
        }

        const productType = await ProductType.findOne({ where: { id: req.params.id } });

        if (!productType) {
            return res.json({
                error: true,
                message: "Aucun type de produit n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            productType
        }).status(200);
    } catch (err) {
        console.error("product-type-get : " + err);
        return res.json({
            error: true,
            message: "Récuperation du type de produit impossible."
        }).status(500);
    }
}

exports.update = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id renseigné n'est pas un nombre."
            }).status(400);
        }
        
        const productType = await ProductType.findOne({ where: { id: req.params.id } });

        if (!productType) {
            return res.json({
                error: true,
                message: "Aucun produit n'est disponible."
            }).status(404);
        }

        const data = {
            name: req.body.name ? req.body.name : productType.name,
            nest_id: req.body.nest_id ? req.body.nest_id : productType.nest_id,
            egg_id: req.body.egg_id ? req.body.egg_id : productType.egg_id
        }

        if (req.body.name && req.body.name !== productType.name) {
            const isExist = await ProductType.findOne({ where: { name: req.body.name } });
            if (isExist) {
                return res.json({
                    error: true,
                    message: "Le nom est déjà utilisé"
                }).status(400);
            }
        }

        await productType.update(data);
        res.json({
            success: true,
            message: "Le type de produit à bien été mis à jour"
        }).status(200);
    } catch (err) {
        console.error("product-type-update : " + err);
        return res.json({
            error: true,
            message: "Mise à jour du type de produit impossible."
        }).status(500);
    }
}

