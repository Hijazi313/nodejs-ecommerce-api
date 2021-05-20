require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const productsRoute = require("./routes/productsRoute");
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

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use("/products", productsRoute);
app.use("/categories", categoryRoute);
app.use("/users", userRoute);

// 404 request
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

// global  error handling middleware
app.use(globalErrorHandler);
module.exports = app;
