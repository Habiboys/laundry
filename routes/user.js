const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const user = require('../controllers/user');
const { Alamat, Layanan } = require('../models');
const getDrivingDistance = require('../controllers/ongkir');
// Home page
router.get('/', isAuthenticated, user.home);
router.get('/home', isAuthenticated, user.home);

// User profile
router.get('/profile', isAuthenticated, hasRole('user'), user.profile);

// Add address page
router.get('/add-address', isAuthenticated, hasRole('user'), user.createAddress);

// Save address
router.post('/save-location', isAuthenticated, hasRole('user'), user.storeAddress);

// Delete address
router.post('/delete-address/:id', isAuthenticated, hasRole('user'), user.deleteAddress);

// Order form page
router.get('/layanan/:id', isAuthenticated, hasRole('user'), user.layanan);
router.post('/pesan', isAuthenticated, hasRole('user'), user.order);
router.get('/pesanan/:id', isAuthenticated, hasRole('user'), user.pesanan);
router.get('/pesanan/batalkan/:id', isAuthenticated, hasRole('user'), user.batalkanPesanan);
router.get('/pesanan-saya', isAuthenticated, hasRole('user'), user.daftarPesanan);
router.post('/bayar/:orderId', isAuthenticated, hasRole('user'), user.createMidtransPayment);



// Endpoint to get delivery fee
router.post('/calculate-ongkir', async (req, res) => {
  const { alamatId } = req.body;
  const laundryLocation = {
    latitude: -0.9150200642195505,
    longitude: 100.35364438372059,
  };

  try {
    const userAddress = await Alamat.findByPk(alamatId);
    const distance = await getDrivingDistance(
      {
        latitude: userAddress.latitude,
        longitude: userAddress.longitude,
      },
      laundryLocation
    );

    let deliveryFee = (distance / 1000) * 5000;
    deliveryFee = Math.ceil(deliveryFee / 100) * 100; // round to nearest 100

    res.json({ deliveryFee });
  } catch (error) {
    console.error("Error calculating delivery fee:", error);
    res.status(500).json({ message: "Error calculating delivery fee" });
  }
});



module.exports = router;
