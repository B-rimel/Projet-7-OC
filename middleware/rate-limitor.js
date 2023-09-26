const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
windowMs: 10 * 60 * 1000,
max: 3,
standardHeaders: true,
legacyHeaders: false,
message: "Cet utilisateur a échoué à se connecter trop de fois. Il pourra retenter ultérieurement."
})

module.exports = { loginLimiter }
