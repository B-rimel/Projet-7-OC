const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
const bookRoutes = require("./routes/Book");

app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);
app.use(express.json());

const mongoose = require("mongoose");
const Book = require("./models/Book");
const User = require("./models/User");

module.exports = app;
