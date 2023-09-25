const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage();
const upload = multer({ storage });

(module.exports = upload.single("image")),
  async (req, res) => {
    const { buffer, originalname } = req.file;
    const name = file.originalname.split(".").slice(0, -1).join("");
    const ref = name + Date.now();
    await sharp(buffer)
      .webp({ quality: 50 })
      .resize({ width: 500, height: 500 })
      .toFile("./images/" + ref)
      .then(console.log(ref));
  };
