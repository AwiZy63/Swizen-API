'use strict';

const Product = require('../../models/products/products.model');
const Joi = require("joi");
const { panel } = require('../../../config/database.config');

const productSchema = Joi.object().keys({
    name: Joi.string().max(255).required(),
    description: Joi.string(),
    price: Joi.number().required(),
    specifics: Joi.string().required().default('{"core": 0, "ram": 0,"storage": 0,"database": 0}'),
    type: Joi.string()
})

exports.create = async (req, res) => {
    try {
        if (!req.body || !req.body.name || !req.body.price || !req.body.specifics) {
            return res.json({
                error: true,
                message: "Requête invalide. Veuillez renseigner toutes les informations requises."
            }).status(400);
        }

        const result = productSchema.validate(req.body);
        if (result.error) {
            console.error(result.value + " " + result.error.message);
            return res.json({
                error: true,
                message: result.error.message
            }).status(400);
        }

        const product = await Product.findOne({ where: { name: result.value.name } });

        if (product) {
            return res.json({
                error: true,
                message: "Le produit existe déjà."
            }).status(400);
        }

        const newProduct = new Product(result.value);
        await newProduct.save();
        return res.json({
            success: true,
            message: 'Création du produit effectué'
        }).status(200);
    } catch (err) {
        console.error("product-create : " + err);
        return res.json({
            error: true,
            message: "Création du produit impossible."
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

        const product = await Product.findOne({ where: { id: req.body.id } });

        if (!product) {
            return res.json({
                error: true,
                message: "Le produit n°" + req.body.id + " est introuvable."
            }).status(404);
        }

        await product.destroy()
        return res.json({
            success: true,
            message: 'Suppression du produit effectué'
        }).status(200);
    } catch (err) {
        console.error("product-delete : " + err);
        return res.json({
            error: true,
            message: "Suppression du produit impossible."
        }).status(500);
    }
}

exports.findAll = async (req, res) => {
    try {
        const products = await Product.findAll();
        
        if (!products) {
            return res.json({
                error: true,
                message: "Aucun produit n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            products
        }).status(200);
    } catch (err) {
        console.error("product-get : " + err);
        return res.json({
            error: true,
            message: "Recupération des produits impossible."
        }).status(500);
    }
}

exports.findById = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id renseigné n'est pas un nombre."
            }).status(400);
        }

        const product = await Product.findOne({ where: { id: req.params.id } });

        if (!product) {
            return res.json({
                error: true,
                message: "Aucun produit n'est disponible."
            }).status(404);
        }

        return res.json({
            success: true,
            product
        }).status(200);
    } catch (err) {
        console.error("product-get : " + err);
        return res.json({
            error: true,
            message: "Recupération du produit impossible."
        }).status(500);
    }
}

exports.update = async (req, res) => {
    try {
        if (!Number(req.params.id)) {
            return res.json({
                error: true,
                message: "L'id est renseigné n'est pas un nombre."
            }).status(400);
        }

        const product = await Product.findOne({ where: { id: req.params.id } })

        if (!product) {
            return res.json({
                error: true,
                message: "Aucun produit n'est disponible."
            }).status(404);
        }

        const data = {
            name: req.body.name ? req.body.name : product.name,
            description: req.body.description ? req.body.description : product.description,
            price: req.body.price ? req.body.price : product.price,
            specifics: req.body.specifics ? req.body.specifics : product.specifics,
            type: req.body.type ? req.body.type : product.type,
            available: req.body.available ? req.body.available : product.available,
            stock: req.body.stock ? req.body.stock : product.stock
        };

        if (req.body.specifics) {
            const specificsJson = JSON.parse(req.body.specifics);

            if (!specificsJson.core || !specificsJson.ram || !specificsJson.storage || !specificsJson.database) {
                return res.json({
                    error: true,
                    message: "Les caractéristiques du produit sont mal définis"
                }).status(400);
            }
        }

        if (req.body.name && req.body.name !== product.name) {
            const isExist = await Product.findOne({ where: { name: req.body.name } });
            if (isExist) {
                return res.json({
                    error: true,
                    message: "Le nom est déjà utilisé"
                }).status(400);
            }
        }

        await product.update(data);
        res.json({
            success: true,
            message: "Le produit à bien été mis à jour"
        }).status(200);
    } catch (err) {
        console.error("product-update : " + err);
        return res.json({
            error: true,
            message: "Mise à jour du produit impossible."
        }).status(500);
    }
}