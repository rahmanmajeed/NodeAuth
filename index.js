// load libraries...
const express = require('express');
const cookieparser = require('cookie-parser');
// express in action  to use...
const app = express();

const { adminMiddleware, basicMiddleware } = require('./Middleware/auth');

const port = 5000;
app.set('view engine', 'ejs');

// connection instance
const { connectDB } = require('./db');

connectDB();

// middleware for grant access to fetch data from request body...
app.use(express.json());

// custom middleware for protect the routes
app.use(cookieparser());

app.use('/api/auth', require('./Auth/Route'));

app.get('/admin', adminMiddleware, (req, res) => res.render('admin'));
app.get('/basic', basicMiddleware, (req, res) => res.render('user'));

const server = app.listen(port, () => console.log(`Server is running ${port} :port`));

// Handling Error
process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});
