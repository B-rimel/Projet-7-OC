const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
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

//Ici, on utilise .sort pour trier les notes moyenne par ordre décroissant, puis .limit pour ne montrer que les 3 premiers (https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/)
exports.getBestBooks = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
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
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
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
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };

  delete requestObject._userId;

  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Accès refusé" });
      } else {
        const filename = book.imageUrl.split("images/")[1];

        Book.updateOne(
          { _id: req.params.id },
          { ...requestObject, _id: req.params.id }
        )
          .then(() => {
            fs.unlink(`images/${filename}`, (error) => {
              if (error) {
                res.status(500).json({
                  message: "Erreur lors de la suppression de l'image",
                });
              } else {
                res
                  .status(200)
                  .json({ message: "Succès de la mise à jour du livre" });
              }
            });
          })
          .catch((error) => {
            res
              .status(500)
              .json({ message: "Erreur lors de la mise à jour du livre" });
          });
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Accès non authorisé" });
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Le livre a été supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.bookRating = (req, res) => {
  const { rating, userId } = req.body;

  if (rating < 1 || rating > 5) {
    res.status(400).json({ error: "La note n'est pas valide" });
  }

  Book.findOne({ _id: req.params.id }).then((book) => {
    if (book.ratings.find((rating) => rating.userId === req.auth.userId)) {
      return res
        .status(403)
        .json({ error: "L'utilisateur a déjà noté ce livre" });
    }
    // Ajout de la note à l'array rating
    else {
      book.ratings.push({
        grade: rating,
        userId: userId,
      });
      // book.save().then().catch();
    }
    


    // Calcul de la somme des notes puis de la moyenne
    const ratingSum = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
    const ratingAverage = ratingSum / book.ratings.length;

    book.averageRating = ratingAverage;
    book.save()
    .then((book) => res.status(201).json(book))
    .catch((error) => res.status(400).json({error}));
  });
};
