const Author = require('../models/author');

// @desc Create a new author
// @route POST /authors
exports.createAuthor = async (req, res, next) => {
  try {
    const { name, bio } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const author = new Author({ name, bio });
    await author.save();

    res.status(201).json(author);
  } catch (error) {
    next(error);
  }
};

// @desc Get all authors
// @route GET /authors
exports.getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.find().sort({ createdAt: -1 });
    res.json(authors);
  } catch (error) {
    next(error);
  }
};

// @desc Get author by ID
// @route GET /authors/:id
exports.getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    next(error);
  }
};

// @desc Update author
// @route PUT /authors/:id
exports.updateAuthor = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      { name, bio },
      { new: true, runValidators: true }
    );

    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    res.json(author);
  } catch (error) {
    next(error);
  }
};

// @desc Delete author
// @route DELETE /authors/:id
exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    next(error);
  }
};
