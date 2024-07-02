"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Layanan extends Model {
    static associate(models) {
      Layanan.hasMany(models.Pemesanan, { foreignKey: 'layananId', onDelete: 'CASCADE' });
    }
  }
  Layanan.init(
    {
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gambar: {
        type: DataTypes.STRING,
      },
      deskripsi: {
        type: DataTypes.TEXT,
      },
      harga: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Layanan",
    }
  );
  return Layanan;
};
