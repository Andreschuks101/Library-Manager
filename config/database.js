const mongoose = require('mongoose');

const connectDb = async () => {
  const uri = process.env.mongodb || process.env.MONGODB_URI;
  if (!uri) {
    console.error('MongoDB connection string is not defined in environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB is connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDb;
