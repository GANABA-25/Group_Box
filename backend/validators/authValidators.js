const { body } = require("express-validator");

const startPrefixes = ["ads", "abs", "eng"];

const signupValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),

  body("schoolEmail")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid school email is required")
    .custom((value) => {
      const domain = value.split("@")[1];
      if (domain !== "ait.edu.gh") {
        throw new Error("Incorrect school email");
      }
      return true;
    }),

  body("studentId")
    .optional({ checkFalsy: true })
    .trim()
    .toLowerCase()
    .isLength({ max: 12 })
    .withMessage("Student ID should not exceed 12 characters")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Student ID must contain only letters and numbers")
    .custom((value) => {
      const startPrefixes = ["ads", "abs", "eng"];
      const startsWithValidPrefix = startPrefixes.some((prefix) =>
        value.startsWith(prefix)
      );
      const endsWithValidSuffix = value.endsWith("y");

      if (!startsWithValidPrefix) {
        throw new Error("Student ID must start with ads, abs, or eng");
      }

      if (!endsWithValidSuffix) {
        throw new Error("Student ID must end with 'y'");
      }

      return true;
    }),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid phone number format"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 12 })
    .withMessage("Password length should be more than twelve characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const resetPasswordTokenValidator = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("Please enter a complete 6-digit OTP")
    .isNumeric()
    .withMessage("Invalid OTP format. The OTP should contain only numbers."),
];

const resetPasswordValidator = [
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 12 })
    .withMessage("Password length should be more than twelve characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),

  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

const updatePersonalInformationValidator = [
  body("fullName").trim().notEmpty().withMessage("Full name is required"),

  body("schoolEmail")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid school email is required")
    .custom((value) => {
      const domain = value.split("@")[1];
      if (domain !== "ait.edu.gh") {
        throw new Error("Incorrect school email");
      }
      return true;
    }),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only digits")
    .matches(/^[0-9]{10}$/)
    .withMessage("Invalid phone number format"),

  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 12 })
    .withMessage("Password length should be more than twelve characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character"),
];

const createGroupValidator = [
  body("groupName").trim().notEmpty().withMessage("Group name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Group description is required"),
];

const joinGroupValidator = [
  body("groupCode").trim().notEmpty().withMessage("Group code is required"),
];

const scoreAssignmentValidator = [
  body("groupScore.contentQuality")
    .notEmpty()
    .withMessage("Content quality score is required.")
    .bail()
    .isNumeric()
    .withMessage("Content quality must be a number.")
    .bail()
    .isFloat({ max: 30 })
    .withMessage("Content quality cannot exceed 30 points."),

  body("groupScore.organizationStructure")
    .notEmpty()
    .withMessage("Organization & structure score is required.")
    .bail()
    .isNumeric()
    .withMessage("Organization & structure must be a number.")
    .bail()
    .isFloat({ max: 25 })
    .withMessage("Organization & structure cannot exceed 25 points."),

  body("groupScore.teamwork")
    .notEmpty()
    .withMessage("Teamwork score is required.")
    .bail()
    .isNumeric()
    .withMessage("Teamwork must be a number.")
    .bail()
    .isFloat({ max: 25 })
    .withMessage("Teamwork cannot exceed 25 points."),

  body("groupScore.overallPresentation")
    .notEmpty()
    .withMessage("Overall presentation score is required.")
    .bail()
    .isNumeric()
    .withMessage("Overall presentation must be a number.")
    .bail()
    .isFloat({ max: 20 })
    .withMessage("Overall presentation cannot exceed 20 points."),

  body("groupScore.bonusPoints")
    .notEmpty()
    .withMessage("Bonus points are required.")
    .bail()
    .isNumeric()
    .withMessage("Bonus points must be a number.")
    .bail()
    .isFloat({ max: 10 })
    .withMessage("Bonus points cannot exceed 10 points."),

  body("groupScore.feedback")
    .trim()
    .notEmpty()
    .withMessage("Feedback is required.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Feedback should be at least 10 characters long."),

  body("individualScores")
    .isArray({ min: 1 })
    .withMessage("At least one individual score is required."),

  body("individualScores.*.studentId")
    .notEmpty()
    .withMessage("Each individual score must have a student ID."),

  body("individualScores.*.contributionScore")
    .notEmpty()
    .withMessage("Contribution score is required.")
    .bail()
    .isNumeric()
    .withMessage("Contribution score must be a number.")
    .bail()
    .isFloat({ max: 40 })
    .withMessage("Contribution score cannot exceed 40 points."),

  body("individualScores.*.qualityScore")
    .notEmpty()
    .withMessage("Quality score is required.")
    .bail()
    .isNumeric()
    .withMessage("Quality score must be a number.")
    .bail()
    .isFloat({ max: 40 })
    .withMessage("Quality score cannot exceed 40 points."),

  body("individualScores.*.collaborationScore")
    .notEmpty()
    .withMessage("Collaboration score is required.")
    .bail()
    .isNumeric()
    .withMessage("Collaboration score must be a number.")
    .bail()
    .isFloat({ max: 20 })
    .withMessage("Collaboration score cannot exceed 20 points."),

  body("individualScores.*.bonusPoints")
    .notEmpty()
    .withMessage("Bonus points are required.")
    .bail()
    .isNumeric()
    .withMessage("Bonus points must be a number.")
    .bail()
    .isFloat({ max: 10 })
    .withMessage("Bonus points cannot exceed 10 points."),

  body("individualScores.*.individualFeedback")
    .trim()
    .notEmpty()
    .withMessage("Individual feedback is required.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Individual feedback must be at least 10 characters long."),
];

module.exports = {
  signupValidator,
  resetPasswordTokenValidator,
  resetPasswordValidator,
  updatePersonalInformationValidator,
  createGroupValidator,
  joinGroupValidator,
  scoreAssignmentValidator,
};
