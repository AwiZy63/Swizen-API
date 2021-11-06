'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class Product extends Model { };

Product.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true, unique: false, defaultValue: null },
    price: { type: DataTypes.DOUBLE(11, 2), allowNull: false, unique: false, defaultValue: 0.00 },
    specifics: { type: DataTypes.TEXT, allowNull: false, unique: false, defaultValue: '{"core": 0, "ram": 0,"storage": 0,"database": 0}' },
    type: {
        type: DataTypes.STRING, allowNull: true, unique: false, defaultValue: null, 
        // references: { table: 'products_types', field: 'name' }, onDelete: 'cascade', onUpdate: 'cascade'
    },
    available: { type: DataTypes.INTEGER, allowNull: false, unique: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, unique: false, defaultValue: 0 }
}, {
    sequelize,
    modelName: 'Products',
    tableName: 'products',
});


module.exports = Product;