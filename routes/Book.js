const express = require("express");
const router = express.Router();

const bookCtrl = require("../controllers/Book");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);

module.exports = router;
