const mongoose = require("mongoose")

const authorSchema = new mongoose.Schema({
  name: {type: String, required:true},
  bio: String,
  dob: String,
  email: String,
 },
 {timestamps: true});

 module.exports = mongoose.model("author", authorSchema)