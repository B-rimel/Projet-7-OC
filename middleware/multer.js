const multer = require("multer");
const sharp = require("sharp");
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");

const { buffer, originalName } = req.file;
const timeStamp = Date.now();
const fileName = req.file.name;
const imgUrl = fileName + timeStamp + req.file.extension;
await sharp(buffer)
  .webp({ quality: 50 })
  .resize({ width: 400, height: 500 })
  .toFile("./images/" + imgUrl);
