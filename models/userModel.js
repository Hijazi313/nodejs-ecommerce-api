const { Schema, model } = require("mongoose");
const { default: validator } = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please tell us your name!"],
      minlength: [4, "User name must be equal or more than 4 characters "],
    },
    photo: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Please Provide Your Email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email address"],
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: [6, "password must be more than 6 characters long"],
      select: false,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    phone: {
      type: Number,
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// MONGOOSE MIDDLEWARES

//  This Pre save middlewares works on creating and saving a document;
// It works on current document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // if the password is actually modified then hash the password
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance Method
// they are available on all documents of a collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
//
userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedAtTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return passwordChangedAtTimeStamp < JWTTimeStamp;
  }

  // if not changed
  return false;
};
const User = model("User", userSchema);

module.exports = User;
