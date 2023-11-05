require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const wavesRouter = require('./routes/waves');

const port = process.env.PORT || 4000;

// Allow cross origin requests from frontend application
app.use(cors());

// Logger for all the api calls
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.path}`);
  next();
});

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
app.use('/waves', wavesRouter);

// Sample end points
app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});

app.get("/name", (req, res, next) => {
  res.send("Welcome to Wave dynamics backend!!!");
});


/**
 * 404 middlware
 */
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Ocean server is listening on port ${port}`);
});
