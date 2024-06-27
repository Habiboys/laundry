var express = require('express');
var router = express.Router();
const authcontroller = require ('../controllers/auth');
const { registerValidation, loginValidation } = require('../middleware/validation');
const { notAuthenticated , isAuthenticated} = require('../middleware/auth');

router.get('/',notAuthenticated , authcontroller.formLogin);
router.get('/login', notAuthenticated ,authcontroller.formLogin);
router.post('/login', loginValidation, authcontroller.login);
router.get('/register',notAuthenticated , authcontroller.formRegis);
router.post('/register',registerValidation, authcontroller.register );
router.post('/logout',isAuthenticated, authcontroller.logout );
module.exports = router;
