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
router
  .route("/:id")
  .patch(protect, restrictTo("user"), updateReview)
  .delete(protect, deleteReview);

// TODO: Get Reviews on asingle Product Route
module.exports = router;
