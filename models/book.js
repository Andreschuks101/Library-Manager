const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
 title: {type: String, required:true},

 Isbn:  {type: String, unique: true},

 authors: [{type: mongoose.Schema.Types.ObjectId, ref: "author"}],

 status: {type: String,
    enum: ["IN", "OUT"],
    default: "IN"
 },

 borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'student' },

 issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'attendant' },

 returnDate: {type: Date, default: null}   
 },
 {timestamps: true});


bookSchema.virtual('isOverdue').get(function() {
    if (this.status === 'OUT' && this.returnDate) {
        return new Date() > this.returnDate;
    }
    return false;
});

bookSchema.set('toJSON', { virtuals: true });
bookSchema.set('toObject', { virtuals: true });

 module.exports = mongoose.model("book", bookSchema)