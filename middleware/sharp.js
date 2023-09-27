const sharp = require("sharp");

module.exports = async(req, res, next) => {
    try{
        if(req.file){
            const {buffer, originalname} = req.file;
            const name = originalname.split(".").slice(0, -1).join("");
            const fileName = name + Date.now()+".webp";

            await sharp(buffer)
            .webp({quality: 50})
            .resize(463, 595, {fit: "cover"})
            .toFile(`images/${fileName}`);

            req.file.filename = fileName;
        }
        next();
    }
    catch(error){
        return res.status(400).json({message: "Erreur de process de l'image"})
    }
}