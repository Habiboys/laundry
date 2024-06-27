var express = require('express');
var router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/auth');

/* GET home page. */
router.get('/', isAuthenticated ,function(req, res, next) {
  res.render('user/home');
});
router.get('/home', isAuthenticated ,function(req, res, next) {
  res.render('user/home');
});


module.exports = router;
