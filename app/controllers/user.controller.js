const User = require("../models/user.model.js");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

exports.register = async (req, res) => {
  console.log("register log");
  const token = await jwt.sign({ name: req.body.name, password: req.body.password }, "secret", {
    expiresIn: "24h",
  });
  // Register a User
  bcrypt.hash(req.body.password, 10).then(function (hash) {
    const user = new User({
      name: req.body.name,
      password: hash,
      email: req.body.email,
    });
    // Save Note in the database

    user
      .save()
      .then((data) => {
        console.log("register then", data);
        res.send({
          data: data,
          token: token,
          userId: user._id,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the User.",
        });
      });
  });
};

exports.login = async (req, res) => {
  console.log("login log");
  const user = await User.findOne({ name: req.body.name });
  if (!user) {
    return res.status(400).send({
      message: "No User Found",
    });
  }
  const result = await bcrypt.compare(req.body.password, user.password);
  if (!result) {
    return res.status(400).send({
      message: "Password Mismatched",
    });
  }
  const token = await jwt.sign({ name: req.body.name, password: req.body.password }, "secret", {
    expiresIn: "24h",
  });
  res.send({
    token: token,
    userId: user._id,
  });
};

exports.detail = async (req, res) => {
  console.log("detail log");
  const user = await User.findOne({ userId: req.params.userId });
  if (!user) {
    return res.status(400).send({
      message: "No User Found",
    });
  }
  res.send({
    userDetail: user,
  });
};
