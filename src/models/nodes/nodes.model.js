'use strict';

const { sequelize } = require('../../../config/database.config');
const { DataTypes, Model } = require("sequelize");

class Node extends Model { };

Node.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    subdomain: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    status: { type: DataTypes.INTEGER(1), allowNull: false, unique: false, defaultValue: 0 },
    type: { type: DataTypes.STRING(255), allowNull: true, unique: false, defaultValue: null }
}, {
    sequelize,
    modelName: 'Nodes',
    tableName: 'nodes'
});

module.exports = Node;