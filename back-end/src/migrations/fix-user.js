"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove deletedAt attribute
    await queryInterface.addColumn("users", "deletedAt", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    },

  async down(queryInterface, Sequelize) {
    // Add deletedAt attribute
    await queryInterface.addColumn("roles", "deletedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
};
