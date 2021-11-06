'use strict';

const { Invoice } = require("../../models/invoices/invoices.model");

exports.findAll = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();

        return res.json({
            success: true,
            invoices
        }).status(200);
    } catch (error) {
        console.log("invoices-find-all", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, permission } = req.decoded;

        const invoice = await Invoice.findOne({ where: { id: id } });

        if (permission <= 0) {
            if (invoice.user_id !== userId) {
                return res.json({
                    error: true,
                    message: "Accès interdit."
                }).status(401);
            }
            if (!invoice) {
                return res.json({
                    error: true,
                    message: "La facture est introuvable."
                }).status(404);
            }
            return res.json({
                success: true,
                invoice
            })
        }   

        if (!invoice) {
            return res.json({
                error: true,
                message: "La facture est introuvable."
            }).status(404);
        }
        
        return res.json({
            success: true,
            invoice
        }).status(200);
    } catch (error) {
        console.log("invoices-find-by-id", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}

exports.findByUserId = async (req, res) => {
    try {
        const { userId } = req.decoded;

        const invoices = await Invoice.findAll({ where: { user_id: userId } });

        return res.json({
            success: true,
            invoices
        }).status(200);
    } catch (error) {
        console.log("invoices-find-by-userid", error);
        return res.json({
            error: true,
            message: error
        }).status(500);
    }
}