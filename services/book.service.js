const bookModel = require('../models/book.model');

module.exports.bookService = async ( userId, title, author, genre, description ) => {
    if (!title || !author || !genre || !description) {
        throw new Error('All fields are required');
    }

    try {
        const book = await bookModel.create({ uploadedBy: userId, title, author, genre, description });
        return book;
    } catch (error) {
        throw new Error(`Error while creating book: ${error.message}`);
    }
}