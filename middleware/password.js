const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema 
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase() 
.has().digits(1) 
.has().not().spaces()
.has().symbols()
.is().not().oneOf(['password', 'Password', '12344567890', '12345678', "Motdepasse!", "Motdepasse1", "Azetyuiop", "00000000", "11111111", "22222222", "33333333", "44444444", "55555555", "66666666", "77777777", "88888888"]);

module.exports = (req, res, next) => {
if (passwordSchema.validate(req.body.password)) {
next();
} else {
return res.status(401).json({
error: `Le mot de passe indiqué est trop faible`
})
}
}
