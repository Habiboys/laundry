'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Layanans', [
      {
        nama: 'Cuci Reguler',
        gambar: 'cuci-reguler.jpg',
        deskripsi: 'Layanan cuci pakaian reguler',
        harga: 5000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Cuci Kilat',
        gambar: 'cuci-kilat.jpg',
        deskripsi: 'Layanan cuci pakaian kilat dengan waktu pengiriman cepat',
        harga: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nama: 'Setrika Hemat',
        gambar: 'setrika-hemat.jpg',
        deskripsi: 'Layanan setrika pakaian dengan biaya hemat',
        harga: 7000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data lainnya sesuai kebutuhan
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Layanans', null, {});
  }
};
