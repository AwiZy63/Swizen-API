'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'support_messages',
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
          allowNull: false,
          unique: false,
        },
        first_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
        },
        last_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: false,
        },
        permission_level: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
        },
        message: {
          type: Sequelize.TEXT,
          allowNull: false,
          unique: false,
        },
        ticket_id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          unique: false,
          references: {
            model: 'support_tickets',
            key: 'id'
          },
          onUpdate: 'cascade',
          onDelete: 'cascade'
        },
        created_at: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('support_messages')
  }
};
