const multer = require("multer");
const Book = require("../models/Book");

exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((book) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ message: "Les livres n'ont pas pu être trouvés" });
    });
};
