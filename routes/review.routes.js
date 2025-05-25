const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const reviewController = require('../controllers/review.controller');

router.put('/:id', authMiddleware.authUser, reviewController.updateReview);
router.delete('/:id', authMiddleware.authUser, reviewController.deleteReview);

module.exports = router;