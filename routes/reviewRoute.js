const express = require("express");
const {
  createReview,
  readAllReview,
  updateReview,
  deleteReview,
  setReviewBody,
} = require("../controllers/reviewsController");
const protect = require("../middlewares/protect");

const router = express.Router();

router.route("/").get(readAllReview).post(protect, setReviewBody, createReview);
router.route("/:id").patch(protect, updateReview).delete(protect, deleteReview);
module.exports = router;
