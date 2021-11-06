'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class SupportMessage extends Model { };

SupportMessage.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false },
    first_name: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    last_name: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: false },
    permission_level: { type: DataTypes.INTEGER(11), allowNull: false, unique: false },
    message: { type: DataTypes.STRING(255), allowNull: true, unique: false, defaultValue: null },
    ticket_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false }
}, {
    sequelize,
    modelName: 'SupportMessage',
    tableName: 'support_messages'
});

module.exports = SupportMessage;