'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'products',
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
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          unique: false,
          defaultValue: null
        },
        price: {
          type: Sequelize.DOUBLE(11, 2),
          allowNull: false, 
          unique: false,
          defaultValue: 0.00
        },
        specifics: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: false,
          defaultValue: '{"core": 0, "ram": 0,"storage": 0,"database": 0}'
        },
        type: {
          type: Sequelize.STRING,
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
        available: {
          type: Sequelize.INTEGER,
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        stock: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products')
  }
};
