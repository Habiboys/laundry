'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const usersData = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin', 10),
        hp: '081234567890',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: await bcrypt.hash('user', 10),
        hp: '087654321098',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: await bcrypt.hash('user', 10),
        hp: '081234567890',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Tambahkan data lainnya sesuai kebutuhan
    ];

    await queryInterface.bulkInsert('Users', usersData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
