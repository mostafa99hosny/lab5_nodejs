
const express = require('express');
const router = express.Router();
const {
  saveTodo,
  getAll,
  getById,
  updateTodo,
  deleteTodo,
  getTodosByUserId
} = require('../controllers/todos');
const { auth , restrictTo } = require('../middlewares/auth');




router.use(auth);

// Create a new todo
router.post("/",restrictTo('admin') ,saveTodo);

// Get all todos with pagination
router.get("/",restrictTo('admin', 'user'), getAll);

// Get todo by ID
router.get("/:id",restrictTo('admin', 'user'), getById);

// Update todo by ID
router.patch("/:id",restrictTo('admin'), updateTodo);

// Delete todo by ID
router.delete("/:id",restrictTo('admin'), deleteTodo);

module.exports = router;