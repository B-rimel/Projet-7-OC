const express = require("express");
const path = require("path");
const app = express();
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

app.use(express.json());


const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userRoutes = require("./routes/User");
const bookRoutes = require("./routes/Book");

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion a MongoDB réussie !"))
  .catch(() => console.log("Echec de connexion a MongoDB !"));

  app.use(mongoSanitize());
  app.use(helmet({crossOriginResourcePolicy: false,})
);

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

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/grimoire/api/auth", userRoutes);
app.use("/grimoire/api/books", bookRoutes);
module.exports = app;
