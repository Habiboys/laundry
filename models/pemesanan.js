'use strict';
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Pemesanan extends Model {
    static associate(models) {
      Pemesanan.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
      Pemesanan.belongsTo(models.Layanan, { foreignKey: 'layananId', onDelete: 'CASCADE' });
      Pemesanan.belongsTo(models.Alamat, { foreignKey: 'AlamatId', onDelete: 'CASCADE' });
    }
  }
  Pemesanan.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      alamatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tanggal: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ongkir: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      berat: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      harga: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      totalHarga: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bayar: {
        type: DataTypes.ENUM('sudah', 'belum'),
        defaultValue: 'belum',
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('menunggu', 'dikonfirmasi', 'diproses', 'diantar', 'selesai'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Pemesanan",
    }
  );
  return Pemesanan;
};
