const todoModel = require("../models/todos");

// Create a new todo
const saveTodo = async (req, res, next) => {
  let newTodo = req.body;
  newTodo.userId = req.userId; // Assign the userId from the token to the new todo
  try {
    const todo = await todoModel.create(newTodo);

    res.status(201).json({
      status: "success",
      message: "saved successfully",
      data: todo,
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message,
    // });
    next(new AppError(err.message, 400));
  }
};

// Get all todos with pagination
const getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    let todos = await todoModel.find()
      .populate("userId", '-password')
      .limit(limit)
      .skip(skip);

    res.status(200).json({
      status: "success",
      data: todos,
    });
  } catch (err) {

    next(new AppError(err.message, 400));

    // res.status(500).json({
    //   status: "error",
    //   message: err.message,
    // });
  }
};

// Get todo by ID
const getById = async (req, res, next) => {
  const { id } = req.params;
  try {
    let todo = await todoModel.findOne({ _id: id });

    if (todo) {
      res.status(200).json({
        status: "success",
        data: todo,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "todo not found",
      });
    }
  } catch (err) {
    // res.status(500).json({
    //   status: "error",
    //   message: err.message,
    // });

    next(new AppError(err.message, 400));

  }
};

// Update todo by ID
const updateTodo = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        status: "fail",
        message: "Todo not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Todo updated successfully",
      data: updatedTodo
    });
  } catch (err) {
    // res.status(400).json({
    //   status: "fail",
    //   message: err.message
    // });

    next(new AppError(err.message, 400));

  }
};

// Delete todo by ID
const deleteTodo = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({
        status: "fail",
        message: "Todo not found"
      });
    }

    res.status(200).json({
      status: "success",
      message: "Todo deleted successfully"
    });
  } catch (err) {
    // res.status(500).json({
    //   status: "error",
    //   message: err.message
    // });

    next(new AppError(err.message, 400));

  }


};

// Get todos by user ID
const getTodosByUserId = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const todos = await todoModel.find({ userId });

    res.status(200).json({
      status: "success",
      data: todos
    });
  } catch (err) {
    // res.status(500).json({
    //   status: "error",
    //   message: err.message
    // });

    next(new AppError(err.message, 400));

  }
};

module.exports = {
  saveTodo,
  getAll,
  getById,
  updateTodo,
  deleteTodo,
  getTodosByUserId
};
