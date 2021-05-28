const express = require("express");
const {
  createReview,
  readAllReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewsController");
const protect = require("../middlewares/protect");

const router = express.Router();

router.route("/").get(readAllReview).post(protect, createReview);
router.route("/:id").patch(protect, updateReview).delete(protect, deleteReview);
module.exports = router;
