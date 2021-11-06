'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class Setting extends Model { };

Setting.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    flag: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    value: { type: DataTypes.STRING(255), allowNull: true, unique: false, defaultValue: true }
}, {
    sequelize,
    modelName: 'Settings',
    tableName: 'settings'
});

module.exports = Setting;