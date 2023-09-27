const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/User");
const password = require("../middleware/password");
const login = require("../middleware/rate-limitor");

router.post("/signup", password, userCtrl.signup);
router.post("/login", login.limiter, userCtrl.login);

module.exports = router;