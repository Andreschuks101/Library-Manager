const express = require('express');
const router = express.Router();
const bookRoutes = require('./books');
const authorRoutes = require('./authors');
const studentRoutes = require('./students');
const attendantRoutes = require('./attendants');
const authRoutes = require('./auth');

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/authors', authorRoutes);
router.use('/students', studentRoutes);
router.use('/attendants', attendantRoutes);

module.exports = router;
