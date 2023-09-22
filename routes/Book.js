const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const bookCtrl = require("../controllers/Book");

router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/", bookCtrl.getAllBooks);

router.post("/:id/rating", auth, bookCtrl.bookRating);
router.put("/:id", auth, multer, bookCtrl.updateBook);
router.delete("/:id", auth, multer, bookCtrl.deleteBook);
router.post("/", auth, multer, bookCtrl.createBook);

module.exports = router;
