'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true
        },
        panel_id: { 
          type: Sequelize.INTEGER(11), 
          allowNull: true, 
          unique: true, 
          defaultValue: null 
        },
        first_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        last_name: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          required: true
        },
        password: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
          required: true
        },
        phone: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        country: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        address: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        city: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        postal_code: {
          type: Sequelize.INTEGER(255),
          allowNull: true,
          unique: false
        },
        wallet: {
          type: Sequelize.FLOAT(),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        additional_address: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        reset_password_token: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        reset_password_expires: {
          type: Sequelize.DATE,
          allowNull: true,
          unique: false
        },
        email_token: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false
        },
        email_token_expires: {
          type: Sequelize.DATE,
          allowNull: true,
          unique: false
        },
        active: {
          type: Sequelize.INTEGER(1),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        suspended: {
          type: Sequelize.INTEGER(1),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        access_token: {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: false
        },
        access_token_expires: {
          type: Sequelize.BIGINT,
          allowNull: true,
          unique: false
        },
        permission_level: {
          type: Sequelize.INTEGER(1),
          allowNull: true,
          unique: false,
          defaultValue: 0
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
};
