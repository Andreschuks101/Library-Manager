const Attendant = require('../models/attendant');

// @desc Create a new attendant
// @route POST /attendants
exports.createAttendant = async (req, res, next) => {
  try {
    const { name, staffId, email, phone, address } = req.body;

    if (!name || !staffId) {
      return res.status(400).json({ message: 'Name and staffId are required' });
    }

    const attendantExists = await Attendant.findOne({ staffId });
    if (attendantExists) {
        return res.status(400).json({ message: 'Attendant with this staffId already exists' });
    }

    const attendant = new Attendant({ name, staffId, email, phone, address });
    await attendant.save();

    res.status(201).json(attendant);
  } catch (error) {
    next(error);
  }
};

// @desc Get all attendants
// @route GET /attendants
exports.getAllAttendants = async (req, res, next) => {
  try {
    const attendants = await Attendant.find().sort({ createdAt: -1 });
    res.json(attendants);
  } catch (error) {
    next(error);
  }
};
