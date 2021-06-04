const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");

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

// READ ONE
exports.getOne = (Model, populateOptions, ...selectedFields) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    selectedFields && (query = query.select(selectedFields.flat().join(" ")));
    populateOptions && (query = query.populate(populateOptions));

    console.log(await Model.findById(req.params.id));
    const doc = await query;

    if (!doc) {
      return next(new AppError("Unable to find this Document", 404));
    } else {
      // Increase Signle product view
      await doc.increaseView();
      doc.save({ validateBeforeSave: false });

      return res.status(200).send({
        message: "OK",
        data: {
          document: doc,
        },
      });
    }
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params);
    // IF IT'S Reviews Route
    let filter = {};
    if (req.params.productId) filter = { product: req.params.productId };
    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .paginate()
      .limitfields()
      .sort();

    // Explain Query for dev purpose
    // const products = await features.query.explain();
    const doc = await features.query;

    if (!doc) {
      return next(new AppError("Unable to find Documents", 424));
    } else {
      return res.status(200).send({
        message: "OK",
        data: {
          documents: doc,
        },
      });
    }
  });
