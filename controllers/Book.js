const multer = require("multer");
const Book = require("../models/Book");
const { request } = require("../app");

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

//Ici, on utilise .sort pour trier les notes moyenne par ordre décroissant, puis .limit pour ne montrer que les 3 premiers (https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/)
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

exports.createBook = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    ratings: [],
    averageRating: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "Le livre a été correctement créé !" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Impossible de créer le livre" });
    });
};

exports.updateBook = (req, res, next) => {
  const requestObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete requestObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(400).json({ message: "Accès refusé" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...requestObject, _id: req.params.id }
        )
          .then(() =>
            res
              .status(200)
              .json({ message: "Succès  de la mise à jour du livre" })
          )
          .catch((error) => res.status(401).json({ message: "Accès refusé" }));
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
