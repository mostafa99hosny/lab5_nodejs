const userModel = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
// Get all users - return only first names
exports.getAll = async (req, res) => {
  try {
    const users = await userModel.find({}, 'firstName');
    res.status(200).json({
      status: "success",
      data: users
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// Register a new user
exports.saveUser = async (req, res) => {
  const user = req.body;



  // Validate the user data using Joi




  // If there's an uploaded image, add the path to the user object
  if (req.file) {
    user.image = req.file.path;
  }

  try {
    const newUser = await userModel.create(user);

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "User deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // If there's an uploaded image, add the path to the updates object
  if (req.file) {
    updates.image = req.file.path;
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: "fail",
        message: "User not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "User was edited successfully",
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

// login

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide username and password"
    });
  }
  
  let users = await userModel.findOne({ username });
  if (!users) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password"
    });
  }
  const isMatch = await bcrypt.compare(password, users.password);
  if (!isMatch) {
    return res.status(401).json({
      status: "fail",
      message: "Invalid username or password"
    });
  }

  const token = jwt.sign({ id: users._id, username: users.username , role: users.role },process.env.SECRET,{ expiresIn: '1h' } );
  res.status(200).json({
    status: "success",
    message: "Login successful",
    token : token,
  });
}






