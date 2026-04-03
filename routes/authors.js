const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController');
const { protect } = require('../middlewares/auth');
const { validateFields } = require('../middlewares/validator');

router.get('/', authorController.getAllAuthors);
router.get('/:id', authorController.getAuthorById);

// Protected routes
router.post('/', protect, validateFields(['name']), authorController.createAuthor);
router.put('/:id', protect, authorController.updateAuthor);
router.delete('/:id', protect, authorController.deleteAuthor);

module.exports = router;
