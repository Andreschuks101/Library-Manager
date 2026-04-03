const Student = require('../models/student');

// @desc Create a new student
// @route POST /students
exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, studentId, phone, address } = req.body;

    if (!name || !email || !studentId) {
      return res.status(400).json({ message: 'Name, email, and studentId are required' });
    }

    const studentExists = await Student.findOne({ $or: [{ email }, { studentId }] });
    if (studentExists) {
        return res.status(400).json({ message: 'Student with this email or studentId already exists' });
    }

    const student = new Student({ name, email, studentId, phone, address });
    await student.save();

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

// @desc Get all students
// @route GET /students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    next(error);
  }
};

// @desc Get student by ID
// @route GET /students/:id
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};
