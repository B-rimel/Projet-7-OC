const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/User");
const signupCheck = require("../middleware/signup");
const login = require("../middleware/rate-limitor");

router.post("/signup", signupCheck, userCtrl.signup);
router.post("/login", login.limiter, userCtrl.login);

module.exports = router;
