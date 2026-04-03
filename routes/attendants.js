const express = require('express');
const router = express.Router();
const attendantController = require('../controller/attendantController');

router.post('/', attendantController.createAttendant);
router.get('/', attendantController.getAllAttendants);

module.exports = router;
