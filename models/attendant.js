const mongoose = require("mongoose")

const attendantSchema = new mongoose.Schema({
    name: {type: String, required:true},
    staffId: {type: String, required:true, unique: true},
    email: {type: String, unique: true},
    phone: String,
    address: String,
},
{timestamps: true});

module.exports = mongoose.model('attendant', attendantSchema);


