'use strict';

const { sequelize } = require('../../../config/database.config');
const bcrypt = require("bcryptjs");
const { DataTypes, Model } = require("sequelize");

class User extends Model {};

User.init({
    id: { type: DataTypes.INTEGER(11), allowNull: false, unique: true, primaryKey: true, autoIncrement: true },
    panel_id: { type: DataTypes.INTEGER(11), allowNull: true, unique: true, defaultValue: null },
    first_name: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    last_name: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true, required: true },
    password: { type: DataTypes.STRING(255), allowNull: false, unique: false, required: true },
    phone: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    country: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    address: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    city: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    postal_code: { type: DataTypes.INTEGER(255), allowNull: true, unique: false },
    wallet: { type: DataTypes.FLOAT(), allowNull: false, unique: false, defaultValue: 0 },
    additional_address: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    reset_password_token: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    reset_password_expires: { type: DataTypes.DATE, allowNull: true, unique: false },
    email_token: { type: DataTypes.STRING(255), allowNull: true, unique: false },
    email_token_expires: { type: DataTypes.DATE, allowNull: true, unique: false },
    active: { type: DataTypes.INTEGER(1), allowNull: false, unique: false, defaultValue: 0 },
    suspended: { type: DataTypes.INTEGER(1), allowNull: false, unique: false, defaultValue: 0 },
    access_token: { type: DataTypes.TEXT, allowNull: true, unique: false },
    access_token_expires: { type: DataTypes.BIGINT, allowNull: true, unique: false },
    permission_level: { type: DataTypes.INTEGER(1), allowNull: true, unique: false, defaultValue: 0 },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users'
});

module.exports = User;

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        throw new Error("Hashing failed", err);
    }
}

module.exports.comparePasswords = async (password, userPassword) => {
    try {
        return await bcrypt.compare(password, userPassword);
    } catch (err) {
        throw new Error("Verification failed", err)
    }
}