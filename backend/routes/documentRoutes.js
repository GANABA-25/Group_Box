const express = require("express");
const { uploadSingle } = require("../middleware/multer");
const isAuthenticated = require("../middleware/isAuthenticated");

const router = express.Router();

const documentsController = require("../controllers/documentController");

router.get("/getGroupFiles", documentsController.getGroupFiles);

router.post(
  "/uploadSelectFiles",
  uploadSingle,
  documentsController.uploadSelectFiles
);

router.post(
  "/recordDocumentsContribution",
  isAuthenticated,
  documentsController.recordDocumentsContribution
);
router.delete("/deleteFile", isAuthenticated, documentsController.deleteFile);

module.exports = router;
