'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Add URL attribute
    await queryInterface.addColumn('tasks', 'url', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Modify realisation attribute type
    await queryInterface.changeColumn('tasks', 'realisation', {
      type: Sequelize.FLOAT,
      allowNull: false,
      defaultValue: 0,
    });

    // Remove color attribute
    await queryInterface.removeColumn('tasks', 'color');
  },

  async down (queryInterface, Sequelize) {
   // Add color attribute
   await queryInterface.addColumn('tasks', 'color', {
    type: Sequelize.STRING,
    allowNull: true
  });

  // Modify realisation attribute type
  await queryInterface.changeColumn('tasks', 'realisation', {
    type: Sequelize.INTEGER,
    allowNull: false
  });

  // Remove URL attribute
  await queryInterface.removeColumn('tasks', 'url');
}
};
