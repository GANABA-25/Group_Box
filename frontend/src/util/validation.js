export const validateSignInData = (data) => {
  const { schoolEmail, password } = data;

  const errors = {
    schoolEmail: !schoolEmail.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)
      ? "Email must be valid"
      : !schoolEmail.toLowerCase().endsWith("@ait.edu.gh")
      ? "Incorrect email"
      : "",
    password: !password.trim() ? "Password is required" : "",
  };

  return errors;
};

export const validateSignUpData = (data) => {
  const {
    fullName,
    schoolEmail,
    studentId,
    phoneNumber,
    password,
    confirmPassword,
  } = data;

  const startPrefixes = ["ads", "abs", "eng"];

  const errors = {
    fullName: !fullName.trim() ? "Full name is required" : "",

    schoolEmail: !schoolEmail.trim()
      ? "A valid school email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)
      ? "Incorrect school email"
      : !schoolEmail.toLowerCase().endsWith("@ait.edu.gh")
      ? "Incorrect school email"
      : "",

    studentId:
      studentId.trim() && studentId !== ""
        ? studentId.length > 12
          ? "Student ID should not exceed 12 characters"
          : !/^[a-zA-Z0-9]+$/.test(studentId)
          ? "Student ID must contain only letters and numbers"
          : !startPrefixes.some((prefix) =>
              studentId.toLowerCase().startsWith(prefix)
            )
          ? "Student ID must start with ads, abs, or eng"
          : !studentId.toLowerCase().endsWith("y")
          ? "Student ID must end with 'y'"
          : ""
        : "",

    phoneNumber: !phoneNumber.trim()
      ? "Phone number is required"
      : phoneNumber.length !== 10
      ? "Phone number must be exactly 10 digits"
      : !/^[0-9]{10}$/.test(phoneNumber)
      ? "Invalid phone number format"
      : "",

    password: !password.trim()
      ? "Password is required"
      : password.length < 12
      ? "Password must be at least 12 characters long"
      : !/[A-Z]/.test(password)
      ? "Password must contain at least one uppercase letter"
      : !/[a-z]/.test(password)
      ? "Password must contain at least one lowercase letter"
      : !/[0-9]/.test(password)
      ? "Password must contain at least one number"
      : !/[\W_]/.test(password)
      ? "Password must contain at least one special character"
      : "",

    confirmPassword: !confirmPassword.trim()
      ? "Confirm password is required"
      : confirmPassword !== password
      ? "Passwords do not match"
      : "",
  };

  return errors;
};

export const validateResetPasswordEmailData = (data) => {
  const { schoolEmail } = data;

  const startPrefixes = ["ads", "abs", "eng"];

  const errors = {
    schoolEmail: !schoolEmail.trim()
      ? "Email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)
      ? "Email must be valid"
      : !startPrefixes.some((prefix) =>
          schoolEmail.toLowerCase().startsWith(prefix)
        )
      ? "Incorrect Email"
      : !schoolEmail.toLowerCase().endsWith("y@ait.edu.gh")
      ? "Incorrect Email"
      : "",
  };

  return errors;
};

export const validateResetPasswordData = (data) => {
  const { password, confirmPassword } = data;

  const errors = {
    password: !password.trim()
      ? "Password is required"
      : password.length < 8
      ? "Password must be at least 8 characters"
      : !/[a-zA-Z]/.test(password)
      ? "Password must include at least one letter"
      : !/[0-9]/.test(password)
      ? "Password must include at least one number"
      : !/[!@#$%^&*(),.?":{}|<>]/.test(password)
      ? "Password must include at least one symbol"
      : "",
    confirmPassword: !confirmPassword.trim()
      ? "Confirm password is required"
      : confirmPassword.length < 8
      ? "Confirm password must be at least 8 characters"
      : !/[a-zA-Z]/.test(confirmPassword)
      ? "Confirm password must include at least one letter"
      : !/[0-9]/.test(confirmPassword)
      ? "Confirm password must include at least one number"
      : !/[!@#$%^&*(),.?":{}|<>]/.test(confirmPassword)
      ? "Confirm password must include at least one symbol"
      : confirmPassword !== password
      ? "Passwords do not match"
      : "",
  };

  return errors;
};

export const validateUpdatePersonalInformation = (data) => {
  const { fullName, schoolEmail, phoneNumber, password } = data;

  const startPrefixes = ["ads", "abs", "eng"];

  const errors = {
    fullName: !fullName.trim() ? "Full name is required" : "",

    schoolEmail: !schoolEmail.trim()
      ? "A valid school email is required"
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(schoolEmail)
      ? "Incorrect school email"
      : !schoolEmail.toLowerCase().endsWith("@ait.edu.gh")
      ? "Incorrect school email"
      : "",

    phoneNumber: !phoneNumber.trim()
      ? "Phone number is required"
      : phoneNumber.length !== 10
      ? "Phone number must be exactly 10 digits"
      : !/^[0-9]{10}$/.test(phoneNumber)
      ? "Invalid phone number format"
      : "",

    password: !password.trim()
      ? "Password is required"
      : password.length < 12
      ? "Password must be at least 12 characters long"
      : !/[A-Z]/.test(password)
      ? "Password must contain at least one uppercase letter"
      : !/[a-z]/.test(password)
      ? "Password must contain at least one lowercase letter"
      : !/[0-9]/.test(password)
      ? "Password must contain at least one number"
      : !/[\W_]/.test(password)
      ? "Password must contain at least one special character"
      : "",
  };

  return errors;
};

export const createGroupValidator = (data) => {
  const { groupName, description } = data;

  const errors = {
    groupName: !groupName.trim() ? "Group name is required" : "",
    description: !description.trim()
      ? "Group description name is required"
      : "",
  };

  return errors;
};

export const joinGroupValidator = (data) => {
  const { groupCode } = data;

  const errors = {
    groupCode: !groupCode.trim() ? "GroupCode is required" : "",
  };

  return errors;
};

export const validateAssignmentData = (assignmentData) => {
  const {
    title,
    description,
    additionalInstructions,
    startDate,
    startTime,
    dueDate,
    dueTime,
    totalPoints,
    group,
    allowedDoc,
  } = assignmentData;

  const errors = {};

  if (!title || !title.trim()) {
    errors.title = "Title is required.";
  }

  if (!description || !description.trim()) {
    errors.description = "Description is required.";
  }

  if (!additionalInstructions || !additionalInstructions.trim()) {
    errors.additionalInstructions = "Additional instructions are required.";
  }

  if (!startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!dueDate) {
    errors.dueDate = "Due date is required.";
  }

  if (!dueTime) {
    errors.dueTime = "Due time is required.";
  }

  if (startDate && startTime && dueDate && dueTime) {
    const start = new Date(`${startDate}T${startTime}`);
    const due = new Date(`${dueDate}T${dueTime}`);

    if (due <= start) {
      errors.dueDate = "Due date/time must be after start date/time.";
    }
  }

  if (!totalPoints) {
    errors.totalPoints = "Total points are required.";
  } else if (isNaN(totalPoints) || Number(totalPoints) <= 0) {
    errors.totalPoints = "Total points must be a positive number.";
  }

  if (!group || group.trim() === "") {
    errors.group = "Please select a group.";
  }

  if (!allowedDoc || allowedDoc.length === 0) {
    errors.allowedDoc = "Select at least one allowed file type.";
  }

  return errors;
};

export const validateGroupAssignmentScore = (assignmentScore) => {
  const {
    contentQuality,
    organizationStructure,
    teamwork,
    overallPresentation,
    bonusPoints,
    feedback,
  } = assignmentScore;

  const errors = {};

  if (contentQuality === "" || contentQuality === null)
    errors.contentQuality = "Content quality score is required.";
  else if (isNaN(contentQuality))
    errors.contentQuality = "Content quality must be a number.";
  else if (Number(contentQuality) > 30)
    errors.contentQuality = "Content quality cannot exceed 30 points.";

  if (organizationStructure === "" || organizationStructure === null)
    errors.organizationStructure =
      "Organization & structure score is required.";
  else if (isNaN(organizationStructure))
    errors.organizationStructure = "Organization & structure must be a number.";
  else if (Number(organizationStructure) > 25)
    errors.organizationStructure =
      "Organization & structure cannot exceed 25 points.";

  if (teamwork === "" || teamwork === null)
    errors.teamwork = "Teamwork score is required.";
  else if (isNaN(teamwork)) errors.teamwork = "Teamwork must be a number.";
  else if (Number(teamwork) > 25)
    errors.teamwork = "Teamwork cannot exceed 25 points.";

  if (overallPresentation === "" || overallPresentation === null)
    errors.overallPresentation = "Overall presentation score is required.";
  else if (isNaN(overallPresentation))
    errors.overallPresentation = "Overall presentation must be a number.";
  else if (Number(overallPresentation) > 20)
    errors.overallPresentation =
      "Overall presentation cannot exceed 20 points.";

  if (bonusPoints === "" || bonusPoints === null)
    errors.bonusPoints = "Bonus points are required.";
  else if (isNaN(bonusPoints))
    errors.bonusPoints = "Bonus points must be a number.";
  else if (Number(bonusPoints) > 10)
    errors.bonusPoints = "Bonus points cannot exceed 10.";

  if (!feedback || feedback.trim() === "")
    errors.feedback = "Feedback is required.";
  else if (feedback.trim().length < 10)
    errors.feedback = "Feedback should be at least 10 characters long.";

  return errors;
};

export const validateIndividualAssignmentScore = (individualScore) => {
  const {
    contributionScore,
    qualityScore,
    collaborationScore,
    bonusPoints,
    individualFeedback,
  } = individualScore;

  const errors = {};

  if (contributionScore === "" || contributionScore === null) {
    errors.contributionScore = "Contribution score is required.";
  } else if (isNaN(contributionScore)) {
    errors.contributionScore = "Contribution score must be a number.";
  } else if (Number(contributionScore) > 40) {
    errors.contributionScore = "Contribution score cannot exceed 40 points.";
  }

  if (qualityScore === "" || qualityScore === null) {
    errors.qualityScore = "Quality score is required.";
  } else if (isNaN(qualityScore)) {
    errors.qualityScore = "Quality score must be a number.";
  } else if (Number(qualityScore) > 40) {
    errors.qualityScore = "Quality score cannot exceed 40 points.";
  }

  if (collaborationScore === "" || collaborationScore === null) {
    errors.collaborationScore = "Collaboration score is required.";
  } else if (isNaN(collaborationScore)) {
    errors.collaborationScore = "Collaboration score must be a number.";
  } else if (Number(collaborationScore) > 20) {
    errors.collaborationScore = "Collaboration score cannot exceed 20 points.";
  }

  if (bonusPoints === "" || bonusPoints === null) {
    errors.bonusPoints = "Bonus points are required.";
  } else if (isNaN(bonusPoints)) {
    errors.bonusPoints = "Bonus points must be a number.";
  } else if (Number(bonusPoints) > 10) {
    errors.bonusPoints = "Bonus points cannot exceed 10 points.";
  }

  if (!individualFeedback || individualFeedback.trim() === "") {
    errors.individualFeedback = "Feedback is required.";
  } else if (individualFeedback.trim().length < 10) {
    errors.individualFeedback = "Feedback must be at least 10 characters long.";
  }

  return errors;
};

export const validateAllIndividualScores = (allScores) => {
  const errors = {};

  for (const [memberId, score] of Object.entries(allScores)) {
    const result = validateIndividualAssignmentScore(score);

    if (Object.keys(result).length > 0) {
      errors[memberId] = result;
    }
  }

  return errors;
};
