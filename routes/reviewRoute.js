const express = require("express");
const {
  createReview,
  readAllReview,
  updateReview,
  deleteReview,
  setReviewBody,
} = require("../controllers/reviewsController");
const protect = require("../middlewares/protect");
const restrictTo = require("../middlewares/restrictTo");

const router = express.Router();

router
  .route("/")
  .get(readAllReview)
  .post(protect, restrictTo("user"), setReviewBody, createReview);

// Get Reviews on a single Product Route
router.route("/:productId").get(readAllReview);

// NOTE: This will make all next routes protected after this middleware
router.use(protect);

router
  .route("/:id")
  .patch(restrictTo("user"), updateReview)
  .delete(deleteReview);

module.exports = router;
