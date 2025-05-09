const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const todosRoutes = require("./routes/todos");
const usersRoutes = require("./routes/users");
const multer = require("multer");
const { getTodosByUserId } = require("./controllers/todos");
const todoModel = require("./models/todos");
const AppError = require("./utils/AppError");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage });
dotenv.config();
mongoose
  .connect("mongodb://127.0.0.1:27017/todosDB")
  .then(() => {
    console.log("database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.set("view engine", "pug");
app.set("views", "./views");

app.get('/todosView', async (req, res) => {

  let todos = await todoModel.find()
  res.render('todos', { todos });
});





app.use(express.static("./static"));
app.use('/uploads', express.static('uploads')); // Serve uploaded files

// Route for getting todos by user ID
app.get("/users/:userId/todos", getTodosByUserId);

// Main routes
app.use("/todos", todosRoutes);
app.use("/users", usersRoutes);

app.post("/upload", upload.single("image"), (req, res) => {
  res.status(200).json({
    status: "success",
    data: req.file,
  });
});


// not found route  
app.use((req, res) => {
 // res.status(404).json({
  //  status: "fail",
  //  message: "Route not found",
 // });

 next(new AppError("Route not found", 404));

});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status:"error",
    message: err.message || "Internal server error"
  })


})
  // Handle errors
  

const port = 3000;

app.listen(port, () => {
  console.log(`server started successfully on port ${port}`);
});
