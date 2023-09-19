const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer");
const bookCtrl = require("../controllers/Book");

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
router.get("/bestrating", bookCtrl.getBestBooks);

router.post("/", auth, multer, bookCtrl.createBook);
module.exports = router;
