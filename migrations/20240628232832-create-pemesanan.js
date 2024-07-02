'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Pemesanans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      layananId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Layanans',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      alamatId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Alamats',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      ongkir: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      berat: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      totalHarga: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bayar: {
        type: Sequelize.ENUM('sudah', 'belum'),
        defaultValue: 'belum',
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('menunggu', 'dikonfirmasi', 'diproses', 'diantar', 'selesai'),
        defaultValue: 'menunggu',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Pemesanans');
  }
};
