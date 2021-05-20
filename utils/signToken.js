const { sign } = require("jsonwebtoken");

module.exports = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
};
