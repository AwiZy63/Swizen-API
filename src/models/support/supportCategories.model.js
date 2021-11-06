'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class SupportCategory extends Model { };

SupportCategory.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true }
}, {
    sequelize,
    modelName: 'SupportCategories',
    tableName: 'support_categories'
});

module.exports = SupportCategory;