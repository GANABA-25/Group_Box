const { validationResult } = require("express-validator");
const User = require("../model/user");
const StudentXP = require("../model/Gamification/studentXP");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../middleware/sendEmail");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const {
      fullName,
      schoolEmail,
      studentId,
      phoneNumber,
      password,
      confirmPassword,
    } = req.body;

    const startPrefixes = ["ads", "abs", "eng"];

    if (
      startPrefixes.some((prefix) =>
        schoolEmail.toLowerCase().startsWith(prefix),
      ) &&
      (!studentId || studentId.trim() === "")
    ) {
      return res.status(400).json({
        message: "studentId is required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const existingUser2 = await User.findOne({ schoolEmail: schoolEmail });
    if (existingUser2) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    let formattedPhoneNumber = phoneNumber.trim();

    if (formattedPhoneNumber.startsWith("+233")) {
      formattedPhoneNumber = formattedPhoneNumber.slice(4);
    } else if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = "233" + formattedPhoneNumber.slice(1);
    }

    if (!/^233\d{9}$/.test(formattedPhoneNumber)) {
      return { error: "Invalid phone number format. Use 233XXXXXXXXX." };
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const ROLES = {
      STUDENT: "student",
      LECTURER: "lecturer",
    };

    let role;
    if (
      startPrefixes.some((prefix) =>
        schoolEmail.toLowerCase().startsWith(prefix),
      )
    ) {
      role = ROLES.STUDENT;
    } else {
      role = ROLES.LECTURER;
    }

    const newUser = new User({
      fullName,
      schoolEmail,
      studentId,
      phoneNumber: formattedPhoneNumber,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "Account created successfully",
    });

    sendEmail(
      schoolEmail,
      `Welcome to GroupBox, ${fullName}!`,
      "Your Collaborative Learning Journey Starts Here",
      `<p>Dear ${fullName},</p>
       <p>Welcome to <strong>GroupBox</strong> – the innovative platform revolutionizing academic collaboration and peer evaluation at Accra Institute of Technology!</p>
        <img src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1750182178/GroupBox/Screenshot_2025-06-17_17-43-39_hpecvo.png" alt="GroupBox Interface" width="600" />
       <p>We're thrilled to support your group work experience with:</p>
       <p>📊 <strong>Automated Contribution Tracking</strong> – Transparently monitor individual participation</p>
       <p>🎯 <strong>Structured Peer Assessment</strong> – Fair, multi-criteria evaluation frameworks</p>
       <p>🏆 <strong>Performance Analytics</strong> – Gamified leaderboards to motivate excellence</p>
       <p>Get started now:</p>
       <p>1. Create your first group project</p>
       <p>2. Assign tasks with clear deadlines</p>
       <p>3. Engage with real-time progress dashboards</p>
       <p>Need guidance? Explore our <a href="#">Tutorial Center</a> or contact <a href="mailto:support@groupbox.edu.gh">our team</a>.</p>
       <p>Here's to more productive, fair, and engaging group work!</p>
       <p>Best regards,<br>
       <strong>The GroupBox Development Team</strong><br>
       Accra Institute of Technology</p>
       <img src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1750184829/GroupBox/Screenshot_2025-06-17_18-28-46_cqgbsl.png" alt="Ait Interface" width="600" />`,
    ).catch((emailError) => {
      console.error("Failed to send email:", emailError);
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred during sign-up. Please try again later.",
    });
  }
};

exports.signin = async (req, res, nex) => {
  try {
    const { schoolEmail, password } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist. Please check your email.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }
    const token = jwt.sign(
      {
        schoolEmail: user.schoolEmail,
        userId: user._id.toString(),
      },
      process.env.JWT_SECRET,
      // { expiresIn: "4h" }
    );

    return res.status(200).json({
      success: true,
      message: "Sign-in successful. Welcome back!",
      token: token,
      user: {
        userName: user.fullName,
        schoolEmail: user.schoolEmail,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber,
        stats: user.stats,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during sign-in. Please try again later.",
    });
  }
};

exports.resetPasswordEmailVerification = async (req, res, next) => {
  try {
    const { schoolEmail } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist. Please check your email.",
      });
    }

    const { phoneNumber } = user;

    if (!phoneNumber) {
      return res
        .status(400)
        .json({ message: "Phone number not associated with this account." });
    }

    const data = {
      expiry: 5,
      length: 6,
      medium: "sms",
      message:
        "GroupBox Password Reset: Your verification code is %otp_code%. This code expires in 5 minutes. Do not share this code with anyone.",
      number: phoneNumber,
      sender_id: "GroupBox",
      type: "numeric",
    };
    const headers = {
      "api-key": process.env.ARKESEL_API_KEY,
    };

    const response = await axios.post(
      "https://sms.arkesel.com/api/otp/generate",
      data,
      { headers },
    );

    if (response.data && response.data.code === "1000") {
      sendEmail(
        schoolEmail,
        "GroupBox Password Reset Request",
        "Reset Your Password - TastyGo",
        `<p>Dear ${user.fullName},</p>
        <p>We received a request to reset your password for your <strong>GroupBox</strong> account.</p>
        <p>If you made this request, please enter the One-Time Password (OTP) sent to your registered phone number to proceed with resetting your password.</p>
        <p><strong>Important:</strong> If you did not request a password reset, please ignore this message and do <strong>not</strong> share the OTP with anyone for security reasons.</p>
        <p>If you have any concerns, please contact our support team.</p>
        <p>Stay safe,<br><strong>The GroupBox Team</strong></p>`,
      ).catch((emailError) => {
        console.error("Failed to send email:", emailError);
      });

      return res.status(200).json({
        success: true,
        message:
          "Verification OTP has been sent to your registered mobile number",
        data: {
          phoneNumber: phoneNumber,
          userId: user._id,
          otpExpiry: "Valid for 5 minutes",
          note: "If you don't receive the OTP, please check your spam or request again after 2 minutes",
        },
      });
    } else {
      const errorMessage =
        response.data?.message || "Failed to send OTP. Try again later.";
      return res.status(500).json({
        message: errorMessage,
        details: response.data,
      });
    }
  } catch (error) {
    console.error("Arkesel API error:", error.response?.data || error.message);
    res.status(500).json({
      message:
        "An error occurred during Email verification. Please try again later.",
    });
  }
};

exports.resetPasswordTokenValidation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed. Please provide valid inputs.",
        errors: errors.array(),
      });
    }

    const { otp, phoneNumber, userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message:
          "The provided phone number is not associated with any account.",
      });
    }

    const data = {
      api_key: process.env.ARKESEL_API_KEY,
      code: otp,
      number: phoneNumber,
    };

    const headers = {
      "api-key": process.env.ARKESEL_API_KEY,
    };

    const response = await axios.post(
      "https://sms.arkesel.com/api/otp/verify",
      data,
      { headers },
    );

    if (response.data && response.data.code === "1104") {
      return res.status(400).json({
        message: "The code entered is incorrect. Please check and try again.",
      });
    }

    if (response.data && response.data.code === "1106") {
      return res.status(503).json({
        message:
          "The verification service is currently unavailable. Please try again shortly.",
      });
    }

    if (response.data && response.data.code === "1103") {
      return res.status(410).json({
        message: "This code has expired. Please request a new OTP to continue.",
      });
    }

    if (response.data && response.data.code === "1100") {
      const resetPasswordToken = jwt.sign(
        {
          otp,
          phoneNumber,
          userId: user._id,
        },
        process.env.JWT_SECRET,
        { expiresIn: "5m" },
      );

      return res.status(200).json({
        success: true,
        message: "OTP verified successfully. You may now reset your password.",
        resetPasswordToken: resetPasswordToken,
      });
    }

    return res.status(500).json({
      message:
        "We were unable to verify your code at this time. Please try again later.",
    });
  } catch (error) {
    res.status(500).json({
      message:
        "An unexpected error occurred while verifying the OTP. Please try again.",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const { password, confirmPassword, resetPasswordToken } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(resetPasswordToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Invalid or expired token. Please request a new OTP.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please try again.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.passwordLastResetAt = new Date();
    user.hasResetPassword = true;

    await user.save();

    sendEmail(
      user.schoolEmail,
      "GroupBox Password Reset Notification",
      "Your Password Has Been Successfully Reset",
      `<html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center;">
            <img src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png" alt="GroupBox Logo" style="width: 120px; margin-bottom: 20px;" />
          </div>

          <h2 style="color: #2c3e50;">Password Reset Successful</h2>
          <p>Dear ${user.fullName},</p>

          <p>We're writing to let you know that the password for your <strong>GroupBox</strong> account has been successfully changed.</p>

          <div style="text-align: center; margin: 20px 0;">
            <img src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749796835/GroupBox/ResetPassword_ixrzg8.svg" alt="Security Icon" style="width: 100px;" />
          </div>

          <p>If you made this change, no further action is required.</p>

          <p><strong>Didn't request this change?</strong><br>
          Please update your password immediately and contact our support team for assistance.</p>

          <p><strong>Security Tips:</strong></p>
          <ul>
            <li>Use a strong and unique password.</li>
            <li>Keep your login credentials confidential.</li>
            <li>Enable two-factor authentication, if available.</li>
          </ul>

          <p>If you need help or have any questions, feel free to reach out to our support team at <a href="mailto:support@groupbox.com">support@groupbox.com</a>.</p>

          <p>Thank you for using GroupBox!<br><strong>The GroupBox Team</strong></p>

          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} GroupBox. All rights reserved.
          </p>
        </div>
      </body>
    </html>`,
    ).catch((emailError) => {
      console.error("Failed to send email:", emailError);
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "An unexpected error occurred while resetting your password. Please try again.",
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const file = req.file;

    const schoolEmail = req.body.schoolEmail;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "GroupBox/profile_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(file.buffer);

    user.profilePicture = result.secure_url;
    await user.save();

    res.json({
      message: "Profile picture updated successfully",
      url: result.secure_url,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updatePersonalInformation = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const { fullName, userSchoolEmail, schoolEmail, phoneNumber, password } =
      req.body;

    const user = await User.findOne({ schoolEmail: userSchoolEmail });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist. Please try again!.",
      });
    }

    let formattedPhoneNumber = phoneNumber.trim();

    if (formattedPhoneNumber.startsWith("+233")) {
      formattedPhoneNumber = formattedPhoneNumber.slice(4);
    } else if (formattedPhoneNumber.startsWith("0")) {
      formattedPhoneNumber = "233" + formattedPhoneNumber.slice(1);
    }

    if (!/^233\d{9}$/.test(formattedPhoneNumber)) {
      return res.status(400).json({
        error: "Invalid phone number format. Use 233XXXXXXXXX.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    user.fullName = fullName;
    user.schoolEmail = schoolEmail;
    user.phoneNumber = formattedPhoneNumber;
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Personal information updated successfully.",
      user: {
        userName: user.fullName,
        schoolEmail: user.schoolEmail,
        studentId: user.studentId,
        phoneNumber: user.phoneNumber,
        userStats: user.stats,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An unexpected error occurred while updating your information. Please try again.",
    });
  }
};

exports.getStudentXp = async (req, res) => {
  try {
    const { schoolEmail } = req.query;

    if (!schoolEmail) {
      return res.status(400).json({ message: "School email is required." });
    }

    const student = await User.findOne({ schoolEmail }).select(
      "_id fullName schoolEmail profilePicture",
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const studentXp = await StudentXP.findOne({
      student: student._id,
    }).populate("student", "fullName schoolEmail profilePicture");

    if (!studentXp) {
      return res.status(200).json({
        message: "Student XP not found — returning default data.",
        studentXp: {
          student: student,
          totalXP: 0,
          level: 1,
          xpHistory: [],
          badges: [],
          submissionHistory: [],
        },
      });
    }

    res.status(200).json({
      message: "Student XP fetched successfully.",
      studentXp,
    });
  } catch (error) {
    console.error("Error fetching student XP:", error);
    res.status(500).json({
      message:
        "An unexpected error occurred while fetching XP. Please try again later.",
      error: error.message,
    });
  }
};
