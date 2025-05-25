const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: 'string',
        required: true,
        trim: true
    },
    author: {
        type: 'string',
        required: true,
        trim: true
    },
    genre: {
        type: 'string',
        required: true,
        trim: true
    },
    description: {
        type: 'string',
        required: true,
        trim: true
    },
    isDeleted: { 
        type: Boolean, 
        default: false },
    },
        { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);