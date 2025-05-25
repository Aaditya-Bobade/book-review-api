const reviewModel = require('../models/review.model');

module.exports.updateReview = async (req, res) => {
    try {
        const reviewId = req.params.id
        const id = req.user._id;
        const userId = id.toString();
        const review = await reviewModel.findOne({ _id: reviewId, user: userId });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        review.rating = req.body.rating || review.rating;
        review.comment = req.body.comment || review.comment;
        const updatedReview = await review.save();
        res.status(200).json({ message: "Review updated successfully", updatedReview });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

module.exports.deleteReview = async (req, res) => {
    try {
        const review = await reviewModel.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}