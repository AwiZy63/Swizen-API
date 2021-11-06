'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'nodes',
      {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        subdomain: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        status: {
          type: Sequelize.INTEGER(1),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        type: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false,
          defaultValue: null,
          references: {
            model: 'products_types',
            key: 'name'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('nodes')
  }
};
