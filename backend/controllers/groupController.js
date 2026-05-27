const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Group = require("../model/group");
const lecturerGroup = require("../model/lecturerGroups");
const User = require("../model/user");
const Document = require("../model/document");
const Assignment = require("../model/assignment");
const Submission = require("../model/submission");
const PeerEval = require("../model/peerEvalSchema");
const AssignmentScore = require("../model/assignmentsScores");
const GroupXP = require("../model/Gamification/groupXP");
const StudentXP = require("../model/Gamification/studentXP");
const {
  computeXpForStudent,
  computeXpForGroup,
  computeBadges,
} = require("../services/xpService");

const { io } = require("../server");

exports.createGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const { groupName, description, schoolEmail } = req.body;

    const existingGroup = await Group.findOne({ groupName: groupName });

    if (existingGroup) {
      return res.status(409).json({
        message: "Group already exists! use another Name",
      });
    }

    function generateGroupCode(length = 6) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }

    let groupCode;
    let exists = true;

    while (exists) {
      groupCode = generateGroupCode();
      const existingCode = await Group.findOne({ groupCode });
      if (!existingCode) {
        exists = false;
      }
    }

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(404).json({
        message: "user does not exist",
      });
    }

    let newGroup;

    if (user.role === "student") {
      newGroup = new Group({
        groupName,
        description,
        groupCode,
        documentId: groupCode,
        createdBy: user._id,
        members: [
          {
            userId: user._id,
            fullName: user.fullName,
            schoolEmail: user.schoolEmail,
            profilePicture: user.profilePicture,
            isLeader: true,
          },
        ],
        notifications: [],
        assignments: [],
        joinedLecturerGroup: null,
      });
    } else if (user.role === "lecturer") {
      newGroup = new lecturerGroup({
        groupName,
        description,
        groupCode,
        createdBy: user._id,
        studentGroups: [],
        notifications: [],
        assignments: [],
      });
    } else {
      return res.status(400).json({
        message:
          "Only users with the role of 'student' or 'lecturer' can create a group.",
      });
    }

    user.stats.totalGroups += 1;
    user.createdGroups.push(newGroup._id);
    user.userGroups.push(newGroup);

    await Promise.all([newGroup.save(), user.save()]);

    res.status(201).json({
      message: "Group created successfully",
      createdGroup: newGroup,
      stats: user.stats,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An unexpected error occurred while attempting to Create a group. Please try again later.",
    });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const { groupCode, studentId } = req.body;

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingGroup = await Group.findOne({ groupCode: groupCode });
    if (!existingGroup) {
      return res.status(404).json({
        message: "Group does not exist",
      });
    }

    const alreadyJoined = user.userGroups.some(
      (groupId) => groupId.toString() === existingGroup._id.toString()
    );

    if (alreadyJoined) {
      return res
        .status(400)
        .json({ message: "You have already joined this group" });
    }

    const newMember = {
      userId: user._id,
      studentId: studentId,
      fullName: user.fullName,
      schoolEmail: user.schoolEmail,
      profilePicture: user.profilePicture,
    };

    existingGroup.members.push(newMember);
    await existingGroup.save();

    user.stats.totalGroups += 1;
    user.userGroups.push(existingGroup._id);
    user.joinedGroups.push(existingGroup._id);
    await user.save();

    return res.status(200).json({
      message: "Successfully joined group",
      group: existingGroup,
      stats: user.stats,
    });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({
      message:
        "An unexpected error occurred while attempting to join the group. Please try again later.",
      error: error.message,
    });
  }
};

exports.joinLectureGroup = async (req, res) => {
  try {
    const { LectureGroupCode, studentsGroupCode } = req.body;

    const studentGroup = await Group.findOne({ groupCode: studentsGroupCode });
    if (!studentGroup) {
      return res.status(404).json({
        message:
          "Student group not found. Please verify the group code and try again.",
      });
    }

    const lectureGroup = await lecturerGroup.findOne({
      groupCode: LectureGroupCode,
    });
    if (!lectureGroup) {
      return res.status(404).json({
        message: "Lecture group not found. Invalid code.",
      });
    }

    const alreadyJoined = lectureGroup.studentGroups.includes(studentGroup._id);
    if (alreadyJoined) {
      return res.status(400).json({
        message: "This student group has already joined the lecture group.",
      });
    }

    lectureGroup.studentGroups.push(studentGroup._id);
    studentGroup.joinedLecturerGroup = lectureGroup._id;
    await lectureGroup.save();
    await studentGroup.save();

    return res.status(200).json({
      message: "Your group has successfully joined the lecture group.",
      lectureGroup,
    });
  } catch (error) {
    console.error("Error joining lecture group:", error.message);
    res.status(500).json({
      message:
        "An unexpected error occurred while attempting to join the lecture group. Please try again later.",
    });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { schoolEmail } = req.query;

    const user = await User.findOne({ schoolEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let userGroups;

    if (user.role === "student") {
      userGroups = await Group.find({ _id: { $in: user.userGroups } }).populate(
        "joinedLecturerGroup",
        "groupName"
      );
    } else if (user.role === "lecturer") {
      userGroups = await lecturerGroup
        .find({ _id: { $in: user.userGroups } })
        .populate("studentGroups");
    }

    if (!userGroups || userGroups.length === 0) {
      return res.status(200).json({
        message: "No Groups Available! Create or join a group.",
        userGroups: [],
      });
    }

    return res.status(200).json({ userGroups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};

exports.submitGroupWork = async (req, res) => {
  try {
    const { schoolEmail, documentId, groupCode, assignmentId } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });
    if (!user) {
      return res.stats(404).json({
        message: "User not found.",
      });
    }

    const userGroup = await Group.findOne({ groupCode: groupCode });
    if (!userGroup) {
      return res.status(404).json({
        message: "Group does not exist",
      });
    }

    const groupDocument = await Document.findById(documentId);
    if (!groupDocument) {
      return res.status(404).json({
        message: "No Document found!",
      });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found!" });
    }

    const submittedAssignment = await Submission.findOne({
      group: userGroup._id,
      assignment: assignment._id,
    });

    if (submittedAssignment) {
      return res.status(400).json({
        message: "Assignment have been submitted already",
      });
    }

    const newSubmission = new Submission({
      assignment: assignment._id,
      assignmentTitle: assignment.title,
      group: userGroup._id,
      document: groupDocument._id,
      submittedBy: user._id,
      dueDate: assignment.dueDate,
      lecturer: assignment.createdBy,
      status: "submitted",
    });

    await newSubmission.save();

    const submissionRecord = {
      assignmentId: assignment._id,
      assignmentTitle: assignment.title,
      groupName: userGroup.groupName,
      submittedAt: new Date(),
      dueDate: assignment.dueDate,
      participated: true,
      student_score: null,
    };

    for (const memberId of userGroup.members) {
      await StudentXP.findOneAndUpdate(
        { student: memberId },
        { $push: { submissionHistory: submissionRecord } },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({
      message: "Assignment submitted successfully!",
      submission: newSubmission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occurred while trying to submit work!. Try again later",
    });
  }
};

exports.groupEvaluationScore = async (req, res) => {
  try {
    const { schoolEmail, groupCode, scores, assignmentId } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const evaluator = await User.findOne({ schoolEmail });
    if (!evaluator) {
      return res.status(404).json({ message: "Evaluator not found" });
    }

    const group = await Group.findOne({ groupCode });
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const alreadySubmitted = await PeerEval.findOne({
      assignmentId,
      groupCode,
      "evaluations.evaluatorEmail": schoolEmail,
    });

    if (alreadySubmitted) {
      return res.status(400).json({
        message:
          "You have already submitted your evaluation for this assignment",
      });
    }

    for (let targetEmail in scores) {
      if (targetEmail === schoolEmail) {
        return res
          .status(400)
          .json({ message: "You cannot evaluate yourself" });
      }

      const memberExists = group.members.some(
        (m) => m.schoolEmail === targetEmail
      );
      if (!memberExists) continue;

      const updated = await PeerEval.findOneAndUpdate(
        {
          assignmentId,
          groupCode,
          targetEmail,
        },
        {
          $push: {
            evaluations: {
              evaluatorEmail: schoolEmail,
              score: scores[targetEmail],
            },
          },
        },
        { upsert: true, new: true }
      );

      const totalScore = updated.evaluations.reduce(
        (acc, e) => acc + e.score,
        0
      );

      const groupSize = group.members.length;
      const maxEvaluators = groupSize - 1;

      const maxTotalScore = maxEvaluators * 10;

      const averageScore =
        maxTotalScore > 0
          ? Number(((totalScore / maxTotalScore) * 10).toFixed(1))
          : 0;

      updated.totalScore = totalScore;
      updated.normalizedScore = averageScore;

      await updated.save();
    }

    const evaluations = await PeerEval.find({ assignmentId, groupCode });

    const finalScores = {};
    evaluations.forEach((ev) => {
      finalScores[ev.targetEmail] = {
        rawTotalScore: ev.totalScore,
        normalizedScore: ev.normalizedScore,
      };
    });

    res.status(200).json({
      message: "Peer evaluation submitted successfully",
      finalScores,
    });
  } catch (error) {
    console.log("Peer evaluation error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.checkPeerEvaluation = async (req, res) => {
  try {
    const { assignmentId, groupCode } = req.query;

    const group = await Group.findOne({ groupCode });
    if (!group) return res.status(404).json({ message: "Group not found" });

    const groupSize = group.members.length;

    const peerRecords = await PeerEval.find({ assignmentId, groupCode });

    const evaluators = new Set();

    peerRecords.forEach((record) => {
      record.evaluations.forEach((ev) => {
        evaluators.add(ev.evaluatorEmail);
      });
    });

    const completedCount = evaluators.size;
    const allCompleted = completedCount === groupSize;

    return res.status(200).json({
      allCompleted,
      completedCount,
      totalMembers: groupSize,
    });
  } catch (error) {
    console.log("Peer evaluation check error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.postAssignment = async (req, res) => {
  try {
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
      schoolEmail,
      status,
    } = req.body;

    const user = await User.findOne({ schoolEmail: schoolEmail });

    if (!user) {
      return res.status(404).json({
        message: "user does not exist",
      });
    }

    if (user.role !== "lecturer") {
      return res
        .status(403)
        .json({ message: "Only lecturers can post assignments" });
    }

    const start = new Date(`${startDate}T${startTime}`);
    const due = new Date(`${dueDate}T${dueTime}`);

    const lecturerGroupData = await lecturerGroup.findById(group);

    if (!lecturerGroupData) {
      return res.status(404).json({ message: "Lecturer group not found" });
    }

    const studentGroups = lecturerGroupData.studentGroups;

    const newAssignment = new Assignment({
      lecturerGroupName: lecturerGroupData.groupName,
      title,
      description,
      additionalInstructions,
      startDate: start,
      dueDate: due,
      totalPoints,
      allowedDoc,
      group,
      studentGroups,
      createdBy: user._id,
      status: status || "published",
    });

    await newAssignment.save();

    const senderLecturerGroups = await lecturerGroup
      .find({
        _id: { $in: group },
      })
      .populate("studentGroups");

    for (const senderLecturerGroup of senderLecturerGroups) {
      for (const studentGroup of senderLecturerGroup.studentGroups) {
        const notification = {
          message: "New Assignment Posted",
          date: new Date(),
          userId: user._id,
          senderName: user.fullName,
          senderGroupCode: senderLecturerGroup.groupCode,
          receiverGroupName: studentGroup.groupName,
        };

        io.to(`group_${studentGroup.groupCode}`).emit("GroupNotification", {
          notification,
        });

        studentGroup.notifications.push(notification);
        await studentGroup.save();
      }
    }

    res.status(201).json({
      message: "Assignment created successfully",
      assignment: newAssignment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occurred while trying to post Assignment!. Try again later",
    });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const { schoolEmail } = req.query;
    const groups = req.query.groups ? JSON.parse(req.query.groups) : [];

    const student = await User.findOne({ schoolEmail });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.role !== "student") {
      return res.status(403).json({ message: "Only students can view this" });
    }

    const assignments = await Assignment.find({
      studentGroups: { $in: groups },
      status: "published",
    })
      .select("-groups -status")
      .populate("createdBy", "name email");

    if (!assignments) {
      return res.status(400).json({
        message: "No Assignments",
      });
    }

    res.status(200).json(assignments);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching assignments" });
  }
};

exports.getCreatedAssignments = async (req, res) => {
  try {
    const { schoolEmail } = req.query;
    const groups = req.query.groups ? JSON.parse(req.query.groups) : [];

    const user = await User.findOne({ schoolEmail: schoolEmail });
    if (!user) {
      return res.stats(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "lecturer") {
      return res.status(403).json({ message: "Only Lecturer's can view this" });
    }

    const createdAssignments = await Assignment.find({
      group: { $in: groups },
      status: "published",
    })
      .select("-groups -status")
      .populate("createdBy", "name email");

    res.status(200).json({
      message: "Created fetched successfully",
      createdAssignments,
    });
  } catch (error) {
    console.log(error);
    res.stats(500).json({
      message:
        "An error occurred while fetching created Groups!. Try again later",
    });
  }
};

exports.getSubmittedAssignments = async (req, res) => {
  try {
    let { schoolEmail, assignmentIds } = req.query;

    if (typeof assignmentIds === "string") {
      try {
        assignmentIds = JSON.parse(assignmentIds);
      } catch (e) {
        return res
          .status(400)
          .json({ message: "Invalid assignmentIds format" });
      }
    }

    const user = await User.findOne({ schoolEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (user.role !== "lecturer") {
      return res.status(403).json({ message: "Only Lecturer's can view this" });
    }

    const submittedAssignments = await Submission.find({
      assignment: { $in: assignmentIds },
      status: "submitted",
    })
      .populate("group")
      .populate("submittedBy", "fullName schoolEmail");

    if (submittedAssignments.length === 0) {
      return res.status(404).json({ message: "No Assignments submitted" });
    }

    const submissionsWithDocsAndEval = await Promise.all(
      submittedAssignments.map(async (sub) => {
        // Get Document
        const doc = await Document.findById(sub.document).populate(
          "files.uploadedBy",
          "fullName schoolEmail"
        );

        // Get Peer Evaluations
        const peerEvaluationsRaw = await PeerEval.find({
          assignmentId: sub.assignment,
          groupCode: sub.group.groupCode,
        });

        // Add target user's fullName
        const peerEvaluations = await Promise.all(
          peerEvaluationsRaw.map(async (evalItem) => {
            const targetUser = await User.findOne(
              { schoolEmail: evalItem.targetEmail },
              "fullName schoolEmail"
            );

            return {
              ...evalItem.toObject(),
              targetUser, // { fullName, schoolEmail }
            };
          })
        );

        return {
          ...sub.toObject(),
          document: doc,
          peerEvaluations,
        };
      })
    );

    return res.status(200).json({
      message: "assignments fetched successfully",
      submittedAssignments: submissionsWithDocsAndEval,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "An error occurred while fetching created Groups!. Try again later",
    });
  }
};

exports.groupAssignmentScore = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array(),
      });
    }

    const {
      groupScore,
      individualScores,
      assignmentId,
      submittedAssignmentId,
      groupCode,
    } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        message: "The specified assignment could not be found.",
      });
    }

    const submittedAssignment = await Submission.findById(
      submittedAssignmentId
    );
    if (!submittedAssignment) {
      return res.status(404).json({
        message: "The submitted assignment record could not be found.",
      });
    }

    const group = await Group.findOne({ groupCode });
    if (!group) {
      return res.status(404).json({
        message: "No group found with the provided group code.",
      });
    }

    const groupDocument = await Document.findById(group.documentId);
    if (!groupDocument) {
      return res.status(404).json({
        message: "No document found for this group.",
      });
    }

    const totalGroupScore =
      Number(groupScore.contentQuality || 0) +
      Number(groupScore.organizationStructure || 0) +
      Number(groupScore.teamwork || 0) +
      Number(groupScore.overallPresentation || 0) +
      Number(groupScore.bonusPoints || 0);

    const groupXpData = computeXpForGroup({
      groupName: group.groupName,
      assignmentTitle: assignment.title,
      submittedAt: new Date(submittedAssignment.submittedAt),
      dueDate: new Date(assignment.dueDate),
      Group_score: totalGroupScore,
      Group_chars: groupDocument.totalChars,
      Group_bonusPoints: groupScore.bonusPoints || 0,
    });

    let groupXP = await GroupXP.findOne({ groupCode: group.groupCode });
    if (!groupXP) {
      groupXP = new GroupXP({ groupCode: group.groupCode });
    }

    groupXP.totalXP += groupXpData.totalXP;
    groupXP.xpHistory.push({
      groupName: group.groupName,
      assignmentTitle: assignment.title,
      action: "Assignment marked",
      description: "XP awarded for completed group assignment.",
      xpAwarded: groupXpData.totalXP,
      xpBreakdown: groupXpData,
      relatedAssignment: assignment._id,
    });

    await groupXP.save({ session });

    const newGroupBadges = computeBadges(groupXP, true);

    if (newGroupBadges.length > 0) {
      for (const badge of newGroupBadges) {
        groupXP.badges.push({
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          xpAwarded: badge.xpAwarded,
        });
        groupXP.totalXP += badge.xpAwarded;
      }

      groupXP.level = Math.floor(groupXP.totalXP / 500) + 1;
      await groupXP.save({ session });
    }

    const individualXPBreakdown = [];

    for (const student of individualScores) {
      const studentContribution = groupDocument.contributions.find(
        (c) => c.user.toString() === student.studentId.toString()
      );

      const participated = studentContribution && studentContribution.chars > 0;
      const studentXpData = computeXpForStudent({
        groupName: group.groupName,
        assignmentTitle: assignment.title,
        submittedAt: new Date(submittedAssignment.submittedAt),
        dueDate: new Date(assignment.dueDate),
        student_score: student.totalIndividualScore,
        student_chars: studentContribution ? studentContribution.chars : 0,
        student_bonusPoints: student.bonusPoints || 0,
        participated,
      });

      let xpBreakdown = {
        submittingAssignmentOnTimeXP: 0,
        submittingAssignmentBeforeDueDateXP: 0,
        scoreThresholdXP: 0,
        participationXP: 0,
        charsXP: 0,
        bonusXP: 0,
        totalXP: 0,
      };

      studentXpData.xpBreakdown.forEach((b) => {
        switch (b.action) {
          case "On-time submission":
            xpBreakdown.submittingAssignmentOnTimeXP = b.xpAwarded;
            break;
          case "Early submission":
            xpBreakdown.submittingAssignmentBeforeDueDateXP = b.xpAwarded;
            break;
          case "High score":
            xpBreakdown.scoreThresholdXP = b.xpAwarded;
            break;
          case "Group participation":
            xpBreakdown.participationXP = b.xpAwarded;
            break;
          case "Chars points":
            xpBreakdown.charsXP = b.xpAwarded;
            break;
          case "Bonus points":
            xpBreakdown.bonusXP = b.xpAwarded;
            break;
        }
      });

      let studentXP = await StudentXP.findOne({ student: student.studentId });
      if (!studentXP) {
        studentXP = new StudentXP({ student: student.studentId });
      }

      xpBreakdown.totalXP = studentXpData.totalXP;
      studentXP.totalXP += studentXpData.totalXP;

      studentXP.level = Math.floor(studentXP.totalXP / 500) + 1;

      xpBreakdown.totalXP = studentXpData.totalXP;
      studentXP.xpHistory.push({
        groupName: group.groupName,
        assignmentTitle: assignment.title,
        action: "Assignment marked",
        description: `XP earned for assignment ${assignment.title}`,
        xpAwarded: studentXpData.totalXP,
        xpBreakdown,
        relatedAssignment: assignment._id,
      });

      studentXP.submissionHistory.push({
        assignmentId: assignment._id,
        assignmentTitle: assignment.title,
        groupName: group.groupName,
        submittedAt: new Date(submittedAssignment.submittedAt),
        dueDate: new Date(assignment.dueDate),
        student_score: student.totalIndividualScore,
        participated,
      });

      await studentXP.save({ session });

      individualXPBreakdown.push({
        studentId: student.studentId,
        xpBreakdown,
      });

      // ----- INTEGRATING -------------
      const newBadges = computeBadges(studentXP);

      if (newBadges.length > 0) {
        for (const badge of newBadges) {
          studentXP.badges.push({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            xpAwarded: badge.xpAwarded,
          });
          studentXP.totalXP += badge.xpAwarded;
        }

        studentXP.level = Math.floor(studentXP.totalXP / 500) + 1;

        await studentXP.save({ session });
      }
    }

    const assignmentScored = new AssignmentScore({
      assignmentId: assignment._id,
      groupId: group._id,
      contentQuality: groupScore.contentQuality,
      organizationStructure: groupScore.organizationStructure,
      teamwork: groupScore.teamwork,
      overallPresentation: groupScore.overallPresentation,
      bonusPoints: groupScore.bonusPoints,
      feedback: groupScore.feedback,
      totalGroupScore: totalGroupScore,
      individualScore: individualScores.map((score) => ({
        studentId: score.studentId,
        contributionScore: score.contributionScore,
        qualityScore: score.qualityScore,
        collaborationScore: score.collaborationScore,
        bonusPoints: score.bonusPoints,
        feedback: score.individualFeedback,
        totalIndividualScore: score.totalIndividualScore,
      })),

      groupXPBreakdown: groupXpData,
      individualXPBreakdown,
    });

    await assignmentScored.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Assignment score, XP, and badges recorded successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error scoring assignment:", error);
    res.status(500).json({
      message:
        "An error occurred while sending assignment scores!. Try again later",
    });
  }
};

exports.getGroupAssignmentScore = async (req, res) => {
  try {
    const { schoolEmail, assignmentIds, groupCodes } = req.query;

    const idsArray = JSON.parse(assignmentIds);
    const codesArray = JSON.parse(groupCodes);

    if (!idsArray.length || !codesArray.length) {
      return res.status(400).json({
        message: "Assignment IDs and group codes are required.",
      });
    }

    const validIds = idsArray.filter((id) => /^[a-f\d]{24}$/i.test(id));
    if (!validIds.length) {
      return res.status(400).json({
        message: "No valid assignment IDs provided.",
      });
    }

    const existingUser = await User.findOne({ schoolEmail });
    if (!existingUser) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const groups = await Group.find({ groupCode: { $in: codesArray } }).select(
      "_id groupName groupCode"
    );

    const groupIds = groups.map((g) => g._id);

    const scoredAssignments = await AssignmentScore.find({
      assignmentId: { $in: validIds },
      groupId: { $in: groupIds },
    })
      .populate({
        path: "assignmentId",
        select: "title lecturerGroupName dueDate",
      })
      .populate({
        path: "groupId",
        select: "groupName groupCode",
      })
      .lean();

    const userSpecificScores = await Promise.all(
      scoredAssignments.map(async (assignment) => {
        const individual = assignment.individualScore.find(
          (i) => i.studentId.toString() === existingUser._id.toString()
        );

        const submission = await Submission.findOne({
          assignment: assignment.assignmentId._id,
          group: assignment.groupId._id,
        }).select("submittedAt");

        return {
          _id: assignment._id,
          assignment: assignment.assignmentId,
          group: assignment.groupId,
          contentQuality: assignment.contentQuality,
          organizationStructure: assignment.organizationStructure,
          teamwork: assignment.teamwork,
          overallPresentation: assignment.overallPresentation,
          bonusPoints: assignment.bonusPoints,
          totalGroupScore: assignment.totalGroupScore,
          feedback: assignment.feedback,
          submittedAt: submission ? submission.submittedAt : null,
          individualScore: individual ? [individual] : [],
          groupXPBreakdown: assignment.groupXPBreakdown || null,
          individualXPBreakdown: assignment.individualXPBreakdown
            ? assignment.individualXPBreakdown.filter(
                (i) => i.studentId.toString() === existingUser._id.toString()
              )
            : [],
        };
      })
    );

    return res.status(200).json({
      message: "Scored assignments fetched successfully.",
      data: userSpecificScores,
    });
  } catch (error) {
    console.error("Error fetching group assignment score:", error.message);
    return res.status(500).json({
      message:
        "An error occurred while fetching assignment scores. Try again later.",
    });
  }
};

exports.getLecturerGroupAssignmentScore = async (req, res) => {
  try {
    const { schoolEmail, groupCodes } = req.query;

    const codesArray = JSON.parse(groupCodes);

    // Check if user exists
    const existingUser = await User.findOne({ schoolEmail });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Fetch groups by groupCode
    const groups = await Group.find({ groupCode: { $in: codesArray } });

    if (!groups || groups.length === 0) {
      return res.status(404).json({
        message: "No groups found for the provided groupCodes",
      });
    }

    const groupIds = groups.map((g) => g._id);

    // Fetch assignment scores
    const scores = await AssignmentScore.find({
      groupId: { $in: groupIds },
    })
      .select("groupId totalGroupScore groupXPBreakdown.totalXP")
      .lean();

    // Map scores with groupName
    const results = scores.map((score) => {
      const group = groups.find(
        (g) => g._id.toString() === score.groupId.toString()
      );
      return {
        _id: score._id,
        groupName: group ? group.groupName : "Unknown Group",
        totalGroupScore: score.totalGroupScore,
        totalXP: score.groupXPBreakdown.totalXP,
        overallPerformance:
          (score.totalGroupScore + score.groupXPBreakdown.totalXP) / 2,
      };
    });

    return res.status(200).json({
      message: "Scores fetched successfully",
      results,
    });
  } catch (error) {
    console.error("Error fetching group assignment score:", error);
    return res.status(500).json({
      message: "An error occurred while fetching assignment scores.",
    });
  }
};

// exports.getStudentGroupsRankings = async (req, res) => {
//   try {
//     const { schoolEmail, joinedLecturerGroupIds } = req.query;

//     const student = await User.findOne({ schoolEmail });
//     if (!student) {
//       return res.status(404).json({
//         message: "Student not found. Try again later.",
//       });
//     }

//     const lecturerGroups = await lecturerGroup
//       .find({
//         _id: { $in: joinedLecturerGroupIds },
//       })
//       .populate({
//         path: "studentGroups",
//         model: "Groups",
//         populate: {
//           path: "joinedLecturerGroup",
//           model: "lecturerGroups",
//           select: "groupName description",
//         },
//       });

//     if (!lecturerGroups.length) {
//       return res.status(404).json({
//         message: "No lecturer groups found for this student.",
//       });
//     }

//     const allStudentGroups = lecturerGroups.flatMap(
//       (lecturerGroup) => lecturerGroup.studentGroups || []
//     );

//     const groupCodes = allStudentGroups.map((g) => g.groupCode);

//     const xpRecords = await GroupXP.find({
//       groupCode: { $in: groupCodes },
//     });

//     const leaderboard = allStudentGroups
//       .map((group) => {
//         const xpData = xpRecords.find((xp) => xp.groupCode === group.groupCode);
//         return {
//           groupName: group.groupName,
//           groupCode: group.groupCode,
//           description: group.description,
//           joinedLecturerGroup: group.joinedLecturerGroup?.groupName || "N/A",
//           totalXP: xpData?.totalXP || 0,
//           level: xpData?.level || 1,
//           memberCount: group.members?.length || 0,
//         };
//       })

//       .sort((a, b) => b.totalXP - a.totalXP);

//     leaderboard.forEach((g, index) => {
//       g.rank = index + 1;
//     });

//     return res.status(200).json({
//       message: "Leaderboard fetched successfully",
//       leaderboard,
//     });
//   } catch (error) {
//     console.error("Error fetching leaderboard:", error);
//     res.status(500).json({
//       message:
//         "An error occurred while fetching Student group leaderboard. Try again later.",
//       error: error.message,
//     });
//   }
// };

exports.getStudentGroupsRankings = async (req, res) => {
  try {
    const { schoolEmail, joinedLecturerGroupIds } = req.query;

    const student = await User.findOne({ schoolEmail });
    if (!student) {
      return res.status(404).json({
        message: "Student not found. Try again later.",
      });
    }

    const lecturerGroups = await lecturerGroup
      .find({
        _id: { $in: joinedLecturerGroupIds },
      })
      .populate({
        path: "studentGroups",
        model: "Groups",
        populate: {
          path: "joinedLecturerGroup",
          model: "lecturerGroups",
          select: "groupName description",
        },
      });

    if (!lecturerGroups.length) {
      return res.status(404).json({
        message: "No lecturer groups found for this student.",
      });
    }

    // Get all student group codes for XP lookup
    const allStudentGroups = lecturerGroups.flatMap(
      (lg) => lg.studentGroups || []
    );
    const groupCodes = allStudentGroups.map((g) => g.groupCode);

    const xpRecords = await GroupXP.find({
      groupCode: { $in: groupCodes },
    });

    // Build structured leaderboard grouped by lecturerGroup
    const leaderboard = lecturerGroups.map((lg) => {
      const joinedStudentGroups = (lg.studentGroups || [])
        .map((group) => {
          const xpData = xpRecords.find(
            (xp) => xp.groupCode === group.groupCode
          );
          return {
            groupName: group.groupName,
            groupCode: group.groupCode,
            description: group.description,
            totalXP: xpData?.totalXP || 0,
            level: xpData?.level || 1,
            memberCount: group.members?.length || 0,
          };
        })
        .sort((a, b) => b.totalXP - a.totalXP)
        .map((g, index) => ({
          ...g,
          rank: index + 1,
        }));

      return {
        lecturerGroupName: lg.groupName,
        lecturerGroupDescription: lg.description,
        joinedStudentGroups,
      };
    });

    return res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      message:
        "An error occurred while fetching Student group leaderboard. Try again later.",
      error: error.message,
    });
  }
};

exports.getGroupsLeader = async (req, res) => {
  try {
    const { schoolEmail } = req.query;

    const student = await User.findOne({ schoolEmail });
    if (!student) {
      return res.status(404).json({
        message: "Student not found. Try again later.",
      });
    }

    const groupXPList = await GroupXP.find()
      .sort({ totalXP: -1 })
      .select("groupCode totalXP level")
      .lean();

    if (!groupXPList.length) {
      return res.status(404).json({
        message: "No groups found for leaderboard.",
      });
    }

    const leaderboard = await Promise.all(
      groupXPList.map(async (groupXP, index) => {
        const group = await Group.findOne({ groupCode: groupXP.groupCode })
          .populate("members", "fullName profilePicture")
          .select("groupName description members")
          .lean();

        return {
          rank: index + 1,
          groupCode: groupXP.groupCode,
          totalXP: groupXP.totalXP,
          level: groupXP.level,
          groupName: group?.groupName || "Unknown Group",
          description: group?.description || "No description provided",
          members:
            group?.members?.map((m) => ({
              fullName: m.fullName,
              profilePicture: m.profilePicture,
            })) || [],
        };
      })
    );

    return res.status(200).json({
      message: "Group leaderboard fetched successfully.",
      leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      message:
        "An error occurred while fetching the leaderboard. Try again later.",
    });
  }
};
