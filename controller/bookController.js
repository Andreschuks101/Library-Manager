const mongoose = require('mongoose');
const Book = require('../models/book');
const Student = require('../models/student');
const Attendant = require('../models/attendant');

const validateObjectId = (id) => mongoose.isValidObjectId(id);

exports.createBook = async (req, res, next) => {
  try {
    const { title, Isbn, authors } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const book = new Book({ title, Isbn, authors });
    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    next(error);
  }
};

exports.getBooks = async (req, res, next) => {
  try {
    const books = await Book.find()
      .populate('authors')
      .populate('borrowedBy', 'name email')
      .populate('issuedBy', 'name email');

    return res.json(books);
  } catch (error) {
    next(error);
  }
};

exports.getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await Book.findById(id)
      .populate('authors')
      .populate('borrowedBy', 'name email')
      .populate('issuedBy', 'name email');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    next(error);
  }
};

exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const updates = req.body;
    const book = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    next(error);
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};

exports.borrowBook = async (req, res, next) => {
  try {
    const { studentId, attendantId, returnDate } = req.body;
    const { id } = req.params;

    if (!studentId || !attendantId || !returnDate) {
      return res.status(400).json({
        message: 'studentId, attendantId, and returnDate are required',
      });
    }

    if (
      !validateObjectId(id) ||
      !validateObjectId(studentId) ||
      !validateObjectId(attendantId)
    ) {
      return res.status(400).json({ message: 'Invalid ID provided' });
    }

    const parsedReturnDate = new Date(returnDate);
    if (Number.isNaN(parsedReturnDate.getTime())) {
      return res.status(400).json({ message: 'Invalid returnDate format' });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.status === 'OUT') {
      return res.status(400).json({ message: 'Book is already out' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendant = await Attendant.findById(attendantId);
    if (!attendant) {
      return res.status(404).json({ message: 'Attendant not found' });
    }

    book.status = 'OUT';
    book.borrowedBy = studentId;
    book.issuedBy = attendantId;
    book.returnDate = parsedReturnDate;

    await book.save();

    return res.status(200).json({
      message: 'Book borrowed successfully',
      book,
    });
  } catch (error) {
    next(error);
  }
};
