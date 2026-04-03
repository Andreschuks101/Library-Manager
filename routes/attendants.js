const express = require('express');
const router = express.Router();
const attendantController = require('../controller/attendantController');
const { protect } = require('../middlewares/auth');
const { validateFields } = require('../middlewares/validator');

// Protect all attendant routes
router.use(protect);

router.post('/', validateFields(['name', 'staffId']), attendantController.createAttendant);
router.get('/', attendantController.getAllAttendants);

module.exports = router;
