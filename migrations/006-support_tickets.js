'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'support_tickets',
      {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: true,
          primaryKey: true,
          autoIncrement: true
        },
        subject: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false
        },
        service: {
          type: Sequelize.STRING(255),
          allowNull: true,
          unique: false,
          defaultValue: null
        },
        category: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
          references: {
            model: 'support_categories',
            key: 'name'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        is_closed: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        is_waiting: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
          defaultValue: 1
        },
        is_answered: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
          defaultValue: 0
        },
        user_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
          references: {
            model: 'users',
            key: 'id'
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
    await queryInterface.dropTable('support_tickets')
  }
};
