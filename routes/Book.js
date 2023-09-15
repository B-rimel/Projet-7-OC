const express = require("express");
const router = express.Router();

const bookCtrl = require("../controllers/Book");

router.get("/books", bookCtrl.getAllBooks);
router.get(".books/:id", bookCtrl.getOneBook);

module.exports = router;
