var express = require('express');
var router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');
const admin = require ('../controllers/admin');

/* GET home page. */
router.get('/', isAuthenticated,admin.dashboard);
router.get('/dashboard', isAuthenticated ,admin.dashboard);
router.get('/pesanan-masuk', admin.pesananMasuk);
router.get('/pesanan-diproses', admin.pesananDiproses);
router.get('/pesanan-selesai', admin.pesananSelesai);
router.post('/konfirmasi-pesanan/:id', admin.konfirmasi);
router.post('/tolak-pesanan/:id', admin.tolak);
router.post('/tambah-berat/:id', admin.tambahBerat);
router.post('/proses-selesai/:id', admin.antar);
router.post('/selesai-antar/:id', admin.selesaiAntar);



// router.get('/add-address', isAuthenticated , hasRole('user'),user.createAddress);

// router.post('/delete-address/:id', isAuthenticated , hasRole('user'), user.deleteAddress);


// router.get('/profile',isAuthenticated , hasRole('user'),user.profile);

// router.post('/save-location' ,isAuthenticated , hasRole('user'), user.storeAddress);



module.exports = router;
