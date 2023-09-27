const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const bookCtrl = require("../controllers/Book");
const sharp = require("../middleware/sharp");

router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);

router.post("/:id/rating", auth, bookCtrl.bookRating);
router.put("/:id", auth, multer, sharp, bookCtrl.updateBook);
router.delete("/:id", auth, multer, bookCtrl.deleteBook);
router.post("/", auth, multer, sharp, bookCtrl.createBook);

module.exports = router;
