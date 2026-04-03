const express = require('express');
const router = express.Router();
const studentController = require('../controller/studentController');
const { protect } = require('../middlewares/auth');
const { validateFields } = require('../middlewares/validator');

// Protect all student routes
router.use(protect);

router.post('/', validateFields(['name', 'email', 'studentId']), studentController.createStudent);
router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);

module.exports = router;
