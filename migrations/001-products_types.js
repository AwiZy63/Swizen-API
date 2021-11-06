'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'products_types',
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
        nest_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false
        },
        egg_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false
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
    await queryInterface.dropTable('products_types')
  }
};
