// --------------- Point level system ---------------
const SUBMITTING_ASSIGNMENT_ON_TIME_XP = 20;
const SUBMITTING_ASSIGNMENT_BEFORE_DUE_DATE = 30;
const SCORE_THRESHOLD = 80;
const SCORE_THRESHOLD_XP = 40;
const PARTICIPATION_XP = 25;
const CHARS_XP = 0.1;
const BONUS_XP = 5;

// --------------- Badges & Achievements ---------------

// XP REWARDS for earning badges
const EARLY_BIRD_XP = 50;
const XP_CHAMPION_XP = 100;
const CONSISTENT_LEARNER_XP = 100;
const COMEBACK_KING_QUEEN_XP = 50;
const STREAK_MASTER_XP = 100;

const computeXpForGroup = ({
  submittedAt,
  dueDate,
  Group_score,
  Group_chars,
  Group_bonusPoints = 0,
}) => {
  let totalXP = 0;
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  const breakdown = {
    submittingAssignmentOnTimeXP: 0,
    submittingAssignmentBeforeDueDateXP: 0,
    scoreThresholdXP: 0,
    participationXP: 0,
    charsXP: 0,
    bonusXP: 0,
  };

  if (submittedAt && dueDate) {
    const submissionDate = new Date(submittedAt);
    const due = new Date(dueDate);
    const timeDiff = due - submissionDate;

    if (submissionDate < due && timeDiff >= sevenDaysInMs) {
      breakdown.submittingAssignmentBeforeDueDateXP =
        SUBMITTING_ASSIGNMENT_BEFORE_DUE_DATE;
      totalXP += SUBMITTING_ASSIGNMENT_BEFORE_DUE_DATE;
    }

    if (
      (submissionDate < due && timeDiff < sevenDaysInMs) ||
      submissionDate.getTime() === due.getTime()
    ) {
      breakdown.submittingAssignmentOnTimeXP = SUBMITTING_ASSIGNMENT_ON_TIME_XP;
      totalXP += SUBMITTING_ASSIGNMENT_ON_TIME_XP;
    }
  }

  if (Group_score >= 80) {
    breakdown.scoreThresholdXP = 40;
    totalXP += 40;
  }

  if (Group_chars > 0) {
    const charsXp = Group_chars * 0.1;
    breakdown.charsXP = charsXp;
    totalXP += charsXp;
  }

  if (Group_bonusPoints > 0) {
    const bonusXP = Group_bonusPoints * 5;
    breakdown.bonusXP = bonusXP;
    totalXP += bonusXP;
  }

  breakdown.totalXP = totalXP;
  return breakdown;
};

const computeXpForStudent = ({
  groupName,
  assignmentTitle,
  relatedAssignment,
  submittedAt,
  dueDate,
  student_score,
  student_chars,
  student_bonusPoints = 0,
  participated,
}) => {
  let totalXP = 0;
  const xpBreakdown = [];

  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  if (submittedAt && dueDate) {
    const submissionDate = new Date(submittedAt);
    const due = new Date(dueDate);
    const timeDiff = due - submissionDate;

    if (submissionDate < due && timeDiff >= sevenDaysInMs) {
      totalXP += SUBMITTING_ASSIGNMENT_BEFORE_DUE_DATE;
      xpBreakdown.push({
        groupName,
        assignmentTitle,
        relatedAssignment,
        action: "Early submission",
        xpAwarded: SUBMITTING_ASSIGNMENT_BEFORE_DUE_DATE,
        description:
          "Submitted the assignment at least 7 days before due date.",
      });
    }

    if (
      (submissionDate < due && timeDiff < sevenDaysInMs) ||
      submissionDate.getTime() === due.getTime()
    ) {
      totalXP += SUBMITTING_ASSIGNMENT_ON_TIME_XP;
      xpBreakdown.push({
        groupName,
        assignmentTitle,
        relatedAssignment,
        action: "On-time submission",
        xpAwarded: SUBMITTING_ASSIGNMENT_ON_TIME_XP,
        description: "Submitted the assignment before or on the due date.",
      });
    }
  }

  if (student_score >= SCORE_THRESHOLD) {
    totalXP += SCORE_THRESHOLD_XP;
    xpBreakdown.push({
      action: "High score",
      xpAwarded: SCORE_THRESHOLD_XP,
      description: `Scored ${student_score}%, above ${SCORE_THRESHOLD_XP}% threshold.`,
    });
  }

  if (participated) {
    totalXP += PARTICIPATION_XP;
    xpBreakdown.push({
      action: "Group participation",
      xpAwarded: PARTICIPATION_XP,
      description: "Participated in a group project.",
    });
  }

  if (student_chars > 0) {
    const charsXp = student_chars * CHARS_XP;
    totalXP += charsXp;
    xpBreakdown.push({
      action: "Chars points",
      xpAwarded: charsXp.toFixed(1),
      description: `Earned ${charsXp.toFixed(1)} chars points.`,
    });
  }

  if (student_bonusPoints > 0) {
    const bonusXP = student_bonusPoints * BONUS_XP;
    totalXP += bonusXP;
    xpBreakdown.push({
      action: "Bonus points",
      xpAwarded: bonusXP,
      description: `Earned ${student_bonusPoints} bonus points.`,
    });
  }

  return { totalXP, xpBreakdown };
};

const computeBadges = (entityXP, isGroup = false) => {
  const badges = [];
  const submissionHistory = entityXP.submissionHistory || [];
  const totalXP = entityXP.totalXP || 0;

  // 🕐 Early Bird – 3 early submissions
  const earlySubmissions = submissionHistory.filter(
    (s) =>
      s.submittedAt &&
      s.dueDate &&
      new Date(s.submittedAt) < new Date(s.dueDate)
  ).length;

  if (
    earlySubmissions >= 3 &&
    !entityXP.badges.some((b) => b.name === "Early Bird")
  ) {
    badges.push({
      name: "Early Bird",
      description: "Submitted 3 assignments before the due date.",
      icon: "🕐",
      xpAwarded: EARLY_BIRD_XP,
    });
  }

  // 🎯 XP Champion – reach 1000 XP
  if (
    totalXP >= 1000 &&
    !entityXP.badges.some((b) => b.name === "XP Champion")
  ) {
    badges.push({
      name: "XP Champion",
      description: "Reached a total XP milestone of 1000 XP.",
      icon: "🎯",
      xpAwarded: XP_CHAMPION_XP,
    });
  }

  // 🧠 Consistent Performer – maintained ≥80% average for 4 weeks
  const now = new Date();
  const fourWeeksAgo = new Date(now.setDate(now.getDate() - 28));
  const recentScores = submissionHistory.filter(
    (s) => s.submittedAt && s.submittedAt >= fourWeeksAgo
  );

  const avgScore =
    recentScores.reduce(
      (sum, s) => sum + (s.student_score || s.group_score || 0),
      0
    ) / (recentScores.length || 1);

  if (
    avgScore >= 80 &&
    !entityXP.badges.some((b) => b.name === "Consistent Performer")
  ) {
    badges.push({
      name: "Consistent Performer",
      description: `Maintained an average above 80% for 4 weeks.`,
      icon: "🧠",
      xpAwarded: CONSISTENT_LEARNER_XP,
    });
  }

  // 💪 Comeback King/Queen – improved score ≥20%
  if (submissionHistory.length >= 2) {
    const last = submissionHistory[submissionHistory.length - 1];
    const prev = submissionHistory[submissionHistory.length - 2];
    const lastScore = last.student_score || last.group_score || 0;
    const prevScore = prev.student_score || prev.group_score || 0;

    if (
      lastScore >= prevScore + 20 &&
      !entityXP.badges.some((b) => b.name === "Comeback King/Queen")
    ) {
      badges.push({
        name: "Comeback King/Queen",
        description:
          "Improved score by ≥20% between two consecutive assignments.",
        icon: "💪",
        xpAwarded: COMEBACK_KING_QUEEN_XP,
      });
    }
  }

  // 🔥 Streak Master – all submissions on time for 1 month
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const pastMonthSubs = submissionHistory.filter(
    (s) => s.submittedAt && s.submittedAt >= monthAgo
  );
  const allOnTime =
    pastMonthSubs.length > 0 &&
    pastMonthSubs.every((s) => new Date(s.submittedAt) <= new Date(s.dueDate));

  if (allOnTime && !entityXP.badges.some((b) => b.name === "Streak Master")) {
    badges.push({
      name: "Streak Master",
      description: "Submitted all assignments on time for 1 month.",
      icon: "🔥",
      xpAwarded: STREAK_MASTER_XP,
    });
  }

  // ✅ Fixed return
  return { totalXP, xpBreakdown: badges };
};

module.exports = {
  computeXpForStudent,
  computeXpForGroup,
  computeBadges,
};
