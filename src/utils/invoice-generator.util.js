const easyinvoice = require('easyinvoice');
const fs = require("fs");
const { Invoice } = require('../models/invoices/invoices.model');
const { invoiceSheet } = require('./sheetsController.util');

const generateInvoice = async (userId, productType, firstname, lastname, address, zip, city, country, currency, products = Array, isCreditMoney = Boolean) => {

    let invoiceNumber;

    const currentInvoices = await Invoice.findAll();
    if (currentInvoices.length === 0) {
        invoiceNumber = 1;
    } else {
        invoiceNumber = currentInvoices.length + 1;
    }

    const client = {
        firstname: firstname,
        lastname: lastname,
        address: address,
        zip: zip,
        city: city,
        country: country
    }

    const currentDate = new Date(Date.now());

    const dateFormat = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()}`


    let invoiceData = {
        "documentTitle": isCreditMoney ? "COMMANDE" : "FACTURE",
        "taxNotation": "vat",
        "marginTop": 25,
        "marginRight": 25,
        "marginLeft": 25,
        "marginBottom": 25,
        "logo": "https://i.ibb.co/0hBrwby/logo.png",
        "background": "",
        "sender": {
            "company": "Swizen",
            "address": "3 rue des écus",
            "zip": "62143",
            "city": "Angres",
            "country": "France",
            "custom1": "891 918 500 00010",
            "custom2": "RCS Arras"
        },
        "client": {
            "company": `${client.firstname} ${client.lastname}`,
            "address": client.address,
            "zip": client.zip,
            "city": client.city,
            "country": client.country,
        },
        "invoiceNumber": invoiceNumber,
        "invoiceDate": dateFormat,
        "products": products,
        "bottomNotice": "TVA non applicable, art. 293 B du CGI"
    };

    invoiceData.locale = 'fr-FR';
    invoiceData.currency = currency;
    invoiceData.translate = {
        "invoiceNumber": "Facture n°",
        "invoiceDate": "Date",
        "products": "Produits",
        "quantity": "Quantité",
        "price": "Prix",
        "subtotal": "Sous total",
        "total": "Total"
    };

    const result = await easyinvoice.createInvoice(invoiceData);

    if (result.pdf) {
        const data = {
            user_id: userId,
            data: result.pdf,
            type: productType
        }
        const newInvoice = new Invoice(data);
        return await newInvoice.save().then(res => {
            invoiceSheet(res.dataValues, "POST");
        }).catch(err => console.log(error));;
    }


}

module.exports = generateInvoice;