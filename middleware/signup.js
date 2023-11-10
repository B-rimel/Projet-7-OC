const passwordValidator = require('password-validator');
let validator = require('validator');

const passwordSchema = new passwordValidator();

passwordSchema 
.is().min(8)
.is().max(50)
.has().uppercase()
.has().lowercase() 
.has().digits(1) 
.has().not().spaces()
.has().symbols()
.is().not().oneOf(['password', 'Password', '12344567890', '12345678', "Motdepasse!", "Motdepasse1", "Azertyuiop", "00000000", "11111111", "22222222", "33333333", "44444444", "55555555", "66666666", "77777777", "88888888", "99999999"]);

module.exports = (req, res, next) => {
    console.log(req.body);
if (passwordSchema.validate(req.body.password) && validator.isEmail(req.body.email)) {
next();
} else if (!passwordSchema.validate(req.body.password)) {
    console.log(passwordSchema.validate(req.body.password))
return res.status(401).json({error: `Le mot de passe saisi est trop faible`})
}
else {
    return res.status(401).json({error: "L'email saisi est invalide"})
}
}