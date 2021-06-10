'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Course.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  };
  Course.init({
    title: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Title is required" }
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notEmpty: { msg: "Description is required" }
      }
    },
    estimatedTime: { type: DataTypes.STRING, allowNull: true },
    materialsNeeded: { type: DataTypes.STRING, allowNull: true },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'User'
        },
        key: 'id'
      },
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};