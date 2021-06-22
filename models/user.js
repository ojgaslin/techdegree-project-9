'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        as: "courses",
        foreignKey: {
          fieldName: 'userId',
          allowNull: false
        }
      });
    }
  };
  User.init({
    firstName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "First Name is required." }
      }
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Last Name is required" }
      }
    },
    emailAddress: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING,
      validate: {
        unique: {msg: "User with this email already exists."},
        notEmpty: { msg: "Email Address is required" }
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notEmpty: { msg: "Password is required" }
      }
    }
  },{
      sequelize,
      modelName: 'User',
    });
  return User;
};