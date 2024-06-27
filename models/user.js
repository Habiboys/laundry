"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
 
    static associate(models) {
      // User.hasOne(models.Lecturer, { foreignKey: "userId" });
      // User.hasOne(models.Student, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      hp: {
        type:DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["admin", "user"],
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
