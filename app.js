const express = require("express");
const app = express();

const userRoutes = require("./routes/User");
app.use("/api/auth", userRoutes);
const bookRoutes = require("./routes/Book");
app.use("/api/books", bookRoutes);

app.use(express.json());

const mongoose = require("mongoose");
const Book = require("./models/Book");
const User = require("./models/User");

mongoose
  .connect(
    "mongodb+srv://lucaafev78:Motdepassetamer!@openclassrooms.n5svtkl.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion a MongoDB réussie !"))
  .catch(() => console.log("Echec de connexion a MongoDB !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

module.exports = app;
