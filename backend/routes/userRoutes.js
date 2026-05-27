const express = require("express");
const { uploadImage } = require("../middleware/multer");

const {
  signupValidator,
  resetPasswordTokenValidator,
  resetPasswordValidator,
  updatePersonalInformationValidator,
} = require("../validators/authValidators");

const router = express.Router();

const userController = require("../controllers/userController");

router.post("/signup", signupValidator, userController.signup);

router.post("/signin", userController.signin);

router.post(
  "/resetPasswordEmailVerification",
  userController.resetPasswordEmailVerification
);

router.post(
  "/resetPasswordTokenValidation",
  resetPasswordTokenValidator,
  userController.resetPasswordTokenValidation
);

router.post(
  "/resetPassword",
  resetPasswordValidator,
  userController.resetPassword
);

router.post(
  "/updateProfilePicture",
  uploadImage,
  userController.updateProfilePicture
);

router.post(
  "/updatePersonalInformation",
  updatePersonalInformationValidator,
  userController.updatePersonalInformation
);

router.get("/studentXp", userController.getStudentXp);

module.exports = router;
