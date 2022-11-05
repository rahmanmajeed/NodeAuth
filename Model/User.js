//user.js
const Mongoose = require('mongoose');

//user schema
const UserSchema = new Mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password:{
        type: String,
        minlength: 6,
        required: true,
    },
    role: {
        type: String,
        default: "Basic",
        required: true,
      },
});

// Creating collection
const User = Mongoose.model('user', UserSchema);//model(<CollectionName>, <CollectionSchema>)

module.exports = User;