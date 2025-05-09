const express = require("express");
const router = express.Router();
const upload = require('../middlewares/upload');
const { getAll, saveUser, deleteUser, updateUser , login } = require('../controllers/users');
const {validate}=require('../middlewares/validate');
const { userSchema } = require('../validation/user.validation');

// Get all users - return first names
router.get("/", getAll);

// Register a user
router.post('/', upload.single('image'), validate(userSchema), saveUser);

// login
router.post('/login', login);

// Delete a user by ID
router.delete('/:id', deleteUser);

// Update a user by ID
router.patch('/:id', upload.single('image'), updateUser);

module.exports = router;
