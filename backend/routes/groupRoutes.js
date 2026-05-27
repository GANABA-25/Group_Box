const express = require("express");
const isAuthenticated = require("../middleware/isAuthenticated");
const {
  createGroupValidator,
  joinGroupValidator,
  scoreAssignmentValidator,
} = require("../validators/authValidators");

const router = express.Router();

const groupController = require("../controllers/groupController");

router.post("/createGroup", createGroupValidator, groupController.createGroup);

router.post("/joinGroup", joinGroupValidator, groupController.joinGroup);

router.post("/joinLectureGroup", groupController.joinLectureGroup);

router.get("/groups", groupController.getGroups);

router.post(
  "/submitGroupWork",
  isAuthenticated,
  groupController.submitGroupWork
);

router.post("/postAssignment", isAuthenticated, groupController.postAssignment);

router.get("/getAssignments", isAuthenticated, groupController.getAssignments);

router.get(
  "/getCreatedAssignments",
  isAuthenticated,
  groupController.getCreatedAssignments
);

router.get(
  "/getSubmittedAssignments",
  isAuthenticated,
  groupController.getSubmittedAssignments
);

router.post(
  "/groupAssignmentScore",
  scoreAssignmentValidator,
  isAuthenticated,
  groupController.groupAssignmentScore
);

router.get(
  "/groupAssignmentScore",
  isAuthenticated,
  groupController.getGroupAssignmentScore
);

router.get(
  "/lecturerGroupAssignmentScore",
  isAuthenticated,
  groupController.getLecturerGroupAssignmentScore
);

router.get(
  "/getGroupsLeader",
  isAuthenticated,
  groupController.getGroupsLeader
);

router.get(
  "/getStudentGroupsRankings",
  isAuthenticated,
  groupController.getStudentGroupsRankings
);

router.post("/groupEvaluationScore", groupController.groupEvaluationScore);

router.get("/checkGroupEvaluationStatus", groupController.checkPeerEvaluation);

module.exports = router;
