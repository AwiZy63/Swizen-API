'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class SupportTicket extends Model { };

SupportTicket.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    subject: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    service: { type: DataTypes.STRING(255), allowNull: true, unique: false, defaultValue: null },
    category: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    is_closed: { type: DataTypes.STRING(255), allowNull: false, unique: false, defaultValue: 0},
    is_waiting: { type: DataTypes.STRING(255), allowNull: false, unique: false, defaultValue: 1},
    is_answered: { type: DataTypes.STRING(255), allowNull: false, unique: false, defaultValue: 0},
    user_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false }
}, {
    sequelize,
    modelName: 'SupportTicket',
    tableName: 'support_tickets'
});

module.exports = SupportTicket;