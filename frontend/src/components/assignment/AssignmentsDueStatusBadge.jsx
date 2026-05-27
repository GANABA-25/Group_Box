import { parseISO, isBefore, differenceInDays } from "date-fns";

const AssignmentsDueStatusBadge = ({ dueDate }) => {
  if (!dueDate) return null;

  const now = new Date();
  const due = parseISO(dueDate);

  const isOverdue = isBefore(due, now);
  const daysLeft = differenceInDays(due, now);
  const isDueSoon = !isOverdue && daysLeft <= 3;

  let label = "On track";
  let bgColor = "bg-green-500";

  if (isOverdue) {
    label = "Overdue";
    bgColor = "bg-red-500";
  } else if (isDueSoon) {
    label = `Due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;
    bgColor = "bg-yellow-500";
  }

  return (
    <div className={`${bgColor} text-white rounded-md text-center px-3 p-1`}>
      <h1 className="text-xs font-Montserrat-Regular">{label}</h1>
    </div>
  );
};

export default AssignmentsDueStatusBadge;
