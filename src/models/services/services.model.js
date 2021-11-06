'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model, Sequelize } = require("sequelize");

class ServiceOrder extends Model { };

ServiceOrder.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false },
    transaction_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true },
    item: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    type: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    cost: { type: DataTypes.FLOAT(), allowNull: false, unique: false },
    status: { type: DataTypes.STRING(255), allowNull: false, unique: false, defaultValue: 'PENDING' }
}, {
    sequelize,
    modelName: 'Orders',
    tableName: 'orders'
});

module.exports = { ServiceOrder };