const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = {
  uploadImage: upload.single("image"),
  uploadSingle: upload.single("file"),
};
