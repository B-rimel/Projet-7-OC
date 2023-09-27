const multer = require("multer");

const storage = multer.memoryStorage();

module.exports = multer({storage}).single('image')
// const sharp = require("sharp");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// module.exports = upload.single("image", async (req, res) => {
//   try {
//     const { buffer, originalname } = req.file;
//     const name = originalname.split(".").slice(0, -1).join("");
//     const ref = name + Date.now();
//     console.log(ref);

//     await sharp(buffer)
//       .webp({ quality: 50 })
//       .resize({ width: 500, height: 500 })
//       .toFile("./images/" + ref + ".webp");

//     console.log(ref);
//     res.status(200).json({ message: "L'image a bien été traitée" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Erreur de traitement de l'image" });
//   }
// });
