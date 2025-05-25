const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const bookController = require('../controllers/book.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/',[
     body('title').notEmpty().withMessage('Title is required'),
     body('author').notEmpty().withMessage('Author is required'),
     body('genre').notEmpty().withMessage('Genre is required'),
     body('description').notEmpty().withMessage('Description is required')],
     authMiddleware.authUser, bookController.addBook);
router.get('/', authMiddleware.authUser, bookController.getAllBooks);
router.get('/:id', authMiddleware.authUser, bookController.getBookById);
router.put('/:id', authMiddleware.authUser, bookController.updateBook);
router.delete('/:id', authMiddleware.authUser, bookController.deleteBook);
router.post('/:id/reviews', authMiddleware.authUser, bookController.addReviewToBook);
module.exports = router;