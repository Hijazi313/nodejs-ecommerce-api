const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const doc = await Model.findByIdAndRemove(id);
    if (!doc) {
      return next(new AppError("Unable to find this Document", 404));
    } else {
      return res.status(204).send({ status: "OK" });
    }
  });

//
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return next(new AppError("This Document does not exist", 404));
    return res.status(200).json({
      status: "OK",
      data: {
        document: doc,
      },
    });
  });

// Works with product and category
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = new Model(req.body);
    const newDocument = await document.save();
    if (!newDocument) {
      nex(new AppError("Document can not be created", 424));
    }
    return res.status(201).send({
      status: "OK",
      data: {
        document: newDocument,
      },
    });
  });
