const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('username').notEmpty().withMessage('Username  wajib disi'),
  body('email').isEmail().withMessage('Invalid email').notEmpty().withMessage('Email  wajib disi'),
  body('password').isLength({ min: 6 }).withMessage('Password harus minimal 6 karakter').notEmpty().withMessage('Password wajib disi'),
  body('confirm-password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Konfirmasi password tidak cocok');
    }
    return true;
  }).notEmpty().withMessage('Konfirmasi password wajib diisi'),
  body('phone').notEmpty().withMessage('No Hp wajib diisi'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const loginValidation = [
  body('email').notEmpty().withMessage('email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = {
  registerValidation,
  loginValidation
};
