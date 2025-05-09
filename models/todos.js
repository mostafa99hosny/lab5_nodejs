const mongoose = require('mongoose')

const todosSchema = mongoose.Schema({
    title: {
       type: String,
       required: [true, "title must be provided"],
       trim: true,
       minLength: [5, "title must be at least 5 characters"],
       maxLength: [20, "title must be less than 20 characters"]
    },
    status: {
        type: String,
        enum: ["to-do", "in progress", "done"],
        default: "to-do"
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    }
}, { timestamps: true }) // Add timestamps for createdAt and updatedAt

const todoModel = mongoose.model('Todo', todosSchema)
module.exports = todoModel