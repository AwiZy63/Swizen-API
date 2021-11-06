'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class Invoice extends Model { };

Invoice.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false },
    data: { type: DataTypes.TEXT('long'), allowNull: false, unique: false },
    type: { type: DataTypes.STRING(255), allowNull: false, unique: false },
}, {
    sequelize,
    modelName: 'Invoices',
    tableName: 'invoices'
});

module.exports = { Invoice };