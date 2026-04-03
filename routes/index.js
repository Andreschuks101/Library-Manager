const express = require('express');
const router = express.Router();
const bookRoutes = require('./books');
const authorRoutes = require('./authors');
const studentRoutes = require('./students');
const attendantRoutes = require('./attendants');

router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/students', studentRoutes);
router.use('/attendants', attendantRoutes);

module.exports = router;
