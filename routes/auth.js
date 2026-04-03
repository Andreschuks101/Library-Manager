const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const { validateFields } = require('../middlewares/validator');

router.post('/register', validateFields(['username', 'password']), authController.register);
router.post('/login', validateFields(['username', 'password']), authController.login);

module.exports = router;
