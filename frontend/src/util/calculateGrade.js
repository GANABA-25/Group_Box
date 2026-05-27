export const calculateGrade = (totalScore) => {
  if (totalScore >= 90 && totalScore <= 100)
    return { grade: "A+", color: "bg-green-600" };
  if (totalScore >= 85 && totalScore <= 89)
    return { grade: "A", color: "bg-green-600" };
  if (totalScore >= 80 && totalScore <= 84)
    return { grade: "A-", color: "bg-green-600" };
  if (totalScore >= 76 && totalScore <= 79)
    return { grade: "B+", color: "bg-green-600" };
  if (totalScore >= 72 && totalScore <= 75)
    return { grade: "B", color: "bg-green-600" };
  if (totalScore >= 68 && totalScore <= 71)
    return { grade: "B-", color: "bg-green-600" };
  if (totalScore >= 64 && totalScore <= 67)
    return { grade: "C+", color: "bg-yellow-400" };
  if (totalScore >= 60 && totalScore <= 63)
    return { grade: "C", color: "bg-yellow-400" };
  if (totalScore >= 57 && totalScore <= 59)
    return { grade: "C-", color: "bg-red-600" };
  if (totalScore >= 54 && totalScore <= 56)
    return { grade: "D+", color: "bg-red-600" };
  if (totalScore >= 51 && totalScore <= 53)
    return { grade: "D", color: "bg-red-600" };
  if (totalScore >= 49 && totalScore <= 50)
    return { grade: "D-", color: "bg-red-600" };
  return { grade: "F", color: "bg-red-600" };
};
