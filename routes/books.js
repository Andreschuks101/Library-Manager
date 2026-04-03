const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');
const { protect } = require('../middlewares/auth');
const { validateFields } = require('../middlewares/validator');

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post('/', protect, validateFields(['title', 'Isbn', 'authors']), bookController.createBook);
router.put('/:id', protect, bookController.updateBook);
router.delete('/:id', protect, bookController.deleteBook);
router.post('/:id/borrow', protect, validateFields(['studentId', 'attendantId', 'returnDate']), bookController.borrowBook);
router.post('/:id/return', protect, bookController.returnBook);

module.exports = router;
