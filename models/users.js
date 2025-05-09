const mongoose = require('mongoose')
const becrypt = require('bcryptjs')
const { route } = require('../routes/users')
const usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: [4, 'Username must be at least 8 characters']
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    // required: true,
    minlength: [3, 'First name must be at least 3 characters'],
    maxlength: [15, 'First name must be less than 15 characters']
  },
  lastName: {
    type: String,
    // required: true,
    minlength: [3, 'Last name must be at least 3 characters'],
    maxlength: [15, 'Last name must be less than 15 characters']
  },
  dob: {
    type: Date,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
}, { timestamps: true }) // Add timestamps for createdAt and updatedAt

usersSchema.pre('save', async function (next) {
    const salt = await becrypt.genSalt(10)
    this.password = await becrypt.hash(this.password, salt)
    next()  
})

const userModel = mongoose.model('User', usersSchema)
module.exports = userModel