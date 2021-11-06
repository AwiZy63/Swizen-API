'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'orders',
      {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true
        },
        user_id: {
          type: Sequelize.INTEGER(11),
          allowNull: true,
          unique: false,
          defaultValue: null,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        transaction_id: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false
        },
        item: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false
        },
        type: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false
        },
        cost: { 
          type: Sequelize.FLOAT(), 
          allowNull: false, 
          unique: false 
        },
        status: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
          defaultValue: 'PENDING'
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
    await queryInterface.dropTable('orders');
  }
};
