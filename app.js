require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productsRoute = require("./routes/productsRoute");
const reviewRoute = require("./routes/reviewRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

const app = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Database connection is ready..."))
  .catch((err) => console.error(err));

// Global Middlewares
// Set security  HTTP headers
app.use(helmet());
// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Limit 100 requests from one IP in one Hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/products/:id", limiter);
app.use(cors());
// Body parser, reading data from  body info req.body
// set the request body data limit to 10KB
app.use(express.json({ limit: "10kb" }));
//  data sanitization against NoSql query injection
app.use(mongoSanitize());
//  data sanitization against XXS
app.use(xss());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// Application Route handlers
app.use("/api/v1/products", productsRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/users", userRoute);

// 404 request
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// global  error handling middleware
app.use(globalErrorHandler);
module.exports = app;
