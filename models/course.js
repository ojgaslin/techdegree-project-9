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
      // define association here
    }
  };
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    estimatedTime: {type:DataTypes.STRING, allowNull: true},
    materialsNeeded: {type:DataTypes.STRING, allowNull: true},
    userId: { 
      type: DataTypes.INTEGER,
      references:{
        model:{
           tableName: 'user'
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