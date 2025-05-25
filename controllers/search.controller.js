const bookModel = require("../models/book.model");

module.exports.serchController = async (req, res) => {
    try {
        const { q } = req.query;
        const books = await bookModel.find({
            $or: [
                { title: new RegExp(q, 'i') }, // 'i' for case-insensitive search
                { author: new RegExp(q, 'i') }
            ]
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}