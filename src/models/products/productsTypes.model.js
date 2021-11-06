'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class ProductType extends Model { };

ProductType.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    nest_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false },
    egg_id: { type: DataTypes.INTEGER(11), allowNull: false, unique: false}
}, {
    sequelize,
    modelName: 'ProductsTypes',
    tableName: 'products_types'
})

module.exports = ProductType;