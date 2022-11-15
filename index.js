// load libraries...
const express = require('express');
const cookieparser = require('cookie-parser');
// express in action  to use...
const app = express();
// middleware for grant access to fetch data from request body...
app.use(express.json());

// custom middleware for protect the routes
app.use(cookieparser());

const port = 5000;
// connection instance
const { connectDB } = require('./db');

const server = app.listen(port, () => console.log(`Server is running ${port} :port`));

connectDB();

// Handling Error
process.on('unhandledRejection', (err) => {
  console.log(`An error occurred: ${err.message}`);
  server.close(() => process.exit(1));
});

app.use('/api/auth', require('./Auth/Route'));
