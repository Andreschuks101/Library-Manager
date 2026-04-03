const mongoose = require("mongoose")

const attendantSchema = new mongoose.Schema({
    name: {type: String, required:true},
    email: {type: String, required:true, unique: true},
    phone: String,
    address: String,
},
{timestamps: true});

module.exports = mongoose.model('attendant', attendantSchema);


