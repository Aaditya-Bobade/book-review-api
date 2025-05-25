const bookModel = require("../models/book.model");
const reviewModel = require("../models/review.model");
const mongoose = require("mongoose");
const bookService = require("../services/book.service");
const { validationResult } = require("express-validator");

module.exports.addBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, author, genre, description } = req.body;
  const userId = req.user._id;

  const book = await bookService.bookService(
    userId,
    title,
    author,
    genre,
    description
  );

  res.status(201).json({ message: "Book added successfully", book });
};

module.exports.getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const filter = { isDeleted: false };
    if (author) filter.author = new RegExp(author, "i"); // 'i' for case-insensitive author;
    if (genre) filter.genre = new RegExp(genre, "i");

    const books = await bookModel
      .find(filter)
      .populate("uploadedBy", "username email -_id")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({ books, message: "Books fetched successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }
    const book = await bookModel
      .findOne({ _id: bookId, isDeleted: false })
      .populate("uploadedBy", "username email -_id");
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const { page = 1, limit = 5 } = req.query;
    const reviews = await reviewModel
      .find({ book: bookId })
      .populate("user", "username")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const avgRating = await reviewModel.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: "$book", avgRating: { $avg: "$rating" } } },
    ]);

    res.json({
      book,
      avgRating: avgRating[0]?.avgRating || 0,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    const book = await bookModel.findById(bookId);

    if (!book || book.isDeleted) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.uploadedBy.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this book" });
    }

    const updatedBook = await bookModel.findByIdAndUpdate(
      bookId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({ message: "Book updated successfully", updatedBook });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    const book = await bookModel.findById(bookId);
    if (!book || book.isDeleted) {
      return res.status(404).json({ error: "Book not found" });
    }
    if (book.uploadedBy.toString() !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this book" });
    }
    book.isDeleted = true;
    await book.save();
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports.addReviewToBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const { rating, comment } = req.body;
    const userId = req.user._id;
    const existingReview = await reviewModel.findOne({
      book: bookId,
      user: userId,
    });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this book" });
    }

    const book = new reviewModel({
        book: bookId,
        user: userId,
        rating,
        comment,
    })
    const savedReview = await book.save();
    res.status(201).json({
      message: "Review added successfully",
      review: savedReview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
