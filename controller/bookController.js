const mongoose = require('mongoose');
const Book = require('../models/book');
const Student = require('../models/student');
const Attendant = require('../models/attendant');
const Author = require('../models/author');

const validateObjectId = (id) => mongoose.isValidObjectId(id);
const validateObjectIdArray = (ids) =>
  Array.isArray(ids) && ids.every((id) => validateObjectId(id));

const validateAuthorsExist = async (authors) => {
  if (!authors || !authors.length) return true;

  const count = await Author.countDocuments({ _id: { $in: authors } });
  return count === authors.length;
};

//1 
exports.createBook = async (req, res, next) => {
  try {
    const { title, Isbn, authors } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Title is required and must be a non-empty string' });
    }

    if (!Isbn || typeof Isbn !== 'string' || !Isbn.trim()) {
      return res.status(400).json({ message: 'Isbn is required and must be a non-empty string' });
    }

    if (!Array.isArray(authors) || !authors.length || !validateObjectIdArray(authors)) {
      return res.status(400).json({ message: 'Authors must be a non-empty array of valid author IDs' });
    }

    if (!(await validateAuthorsExist(authors))) {
      return res.status(400).json({ message: 'One or more authors do not exist' });
    }

    const book = new Book({ title, Isbn, authors });
    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Isbn) {
      return res.status(400).json({ message: 'A book with that ISBN already exists' });
    }
    next(error);
  }
};

//2
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

//3
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

//4
exports.updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({ message: 'Invalid book ID' });
    }

    const allowedFields = ['title', 'Isbn', 'authors'];
    const requestFields = Object.keys(req.body);
    const invalidFields = requestFields.filter((field) => !allowedFields.includes(field));

    if (invalidFields.length) {
      return res.status(400).json({ message: `Invalid fields: ${invalidFields.join(', ')}` });
    }

    const updates = {};
    for (const key of requestFields) {
      updates[key] = req.body[key];
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    if (updates.title !== undefined && (typeof updates.title !== 'string' || !updates.title.trim())) {
      return res.status(400).json({ message: 'Title must be a non-empty string' });
    }

    if (updates.Isbn !== undefined && (typeof updates.Isbn !== 'string' || !updates.Isbn.trim())) {
      return res.status(400).json({ message: 'Isbn must be a non-empty string' });
    }

    if (updates.authors !== undefined) {
      if (!Array.isArray(updates.authors) || !updates.authors.length || !validateObjectIdArray(updates.authors)) {
        return res.status(400).json({ message: 'Authors must be a non-empty array of valid author IDs' });
      }

      if (!(await validateAuthorsExist(updates.authors))) {
        return res.status(400).json({ message: 'One or more authors do not exist' });
      }
    }

    const book = await Book.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    return res.json(book);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.Isbn) {
      return res.status(400).json({ message: 'A book with that ISBN already exists' });
    }
    next(error);
  }
};

//5 done
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
