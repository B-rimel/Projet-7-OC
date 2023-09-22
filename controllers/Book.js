const multer = require("multer");
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
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
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
  delete req.body._id;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        const newRating = newBook({
          userId: req.auth.userId,
          grade: req.body.rating,
        });
        console.log(newRating);
      } else if (req.body.rating < 1 || req.body.rating > 5) {
        throw new Error("La note n'est pas valide !");
      } else {
        const ratings = book.ratings;
        if (!ratings.find((rating) => rating.userId === req.auth.userId)) {
          const newRating = {
            userId: req.auth.userId,
            grade: req.body.rating,
          };
          ratings.push(newRating);
          calculateAverageRating(book.ratings);
          Book.updateOne(
            { _id: book._id },
            { averageRating: calculateAverageRating(book.ratings) }
          )
            .then(() => res.status(200).json({ message: "Moyenne postée !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(400).json({ error: error }));
};

function calculateAverageRating(ratings) {
  let totalGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  totalGrades = totalGrades / ratings.length;
  console.log(totalGrades);
}
