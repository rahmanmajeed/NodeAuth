const mongoose = require('mongoose');

const DB = 'mongodb://localhost:27017/user_auth';

const connectDB = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('MongoDB Connected');
};
module.exports = { connectDB, DB };
