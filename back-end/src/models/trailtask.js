'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trailTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      trailTask.belongsTo(models.user, {
        foreignKey:'userId'
      })
    }
  }
  trailTask.init({
    eventType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    oldValues: {
      type: DataTypes.STRING.BINARY,
    },
    newValues: {
      type: DataTypes.STRING.BINARY,
    },
    attributes: {
      type: DataTypes.STRING.BINARY,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
  }, {
    sequelize,
    modelName: 'trailTask',
  });
  return trailTask;
};