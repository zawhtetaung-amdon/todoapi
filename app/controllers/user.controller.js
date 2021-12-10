const User = require("../models/user.model.js");
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

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
  try {
    console.log("detail log", req.params.userId);
    const user = await User.findOne({ _id: ObjectId(req.params.userId) });
    console.log("user is", user);
    if (!user) {
      return res.status(400).send({
        message: "No User Found",
      });
    }
    res.send({
      userDetail: user,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message || "Something Wrong",
    });
  }
};

exports.edit = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({
      message: "User name empty",
    });
  }
  try {
    const oldUser = await User.findOne({
      _id: ObjectId(req.params.userId),
    });
    if (!oldUser) {
      return res.status(400).send({
        message: "Not found user",
      });
    }
    User.findOneAndUpdate(
      {
        _id: ObjectId(req.params.userId),
      },
      {
        name: req.body.name || "Untitled Note",
        password: req.body.password,
        email: req.body.email,
        profileImg: req.file.path || oldUser.profileImg,
      },
      { new: true }
    )
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: "User not found with id " + req.params.userId,
          });
        }
        res.send(user);
      })
      .catch((err) => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "User not found with id " + req.params.userId,
          });
        }
        return res.status(500).send({
          message: "Error updating user with id " + req.params.userId,
        });
      });
  } catch (error) {
    res.status(400).send({
      message: error.message || "Something Wrong",
    });
  }
};
