import { parseISO, isBefore, isAfter } from "date-fns";
import { useMemo } from "react";

const AssignmentFilterBar = ({
  assignments,
  showAssignments,
  setShowAssignments,
}) => {
  const { dueSoonCount, overdueCount, completedCount } = useMemo(() => {
    let dueSoon = 0;
    let overdue = 0;
    let completed = 0;

    const now = new Date();

    assignments.forEach((assignment) => {
      const dueDate = assignment?.dueDate ? parseISO(assignment.dueDate) : null;

      if (assignment?.completed) {
        completed++;
      } else if (dueDate && isBefore(dueDate, now)) {
        overdue++;
      } else if (dueDate && isAfter(dueDate, now)) {
        dueSoon++;
      }
    });

    return {
      dueSoonCount: dueSoon,
      overdueCount: overdue,
      completedCount: completed,
    };
  }, [assignments]);

  const assignmentTimeLine = [
    {
      id: 1,
      label: "Due soon",
      number: dueSoonCount,
    },
    {
      id: 2,
      label: "Overdue",
      number: overdueCount,
    },
    {
      id: 3,
      label: "completed",
      number: completedCount,
    },
  ];

  return (
    <ul className="grid grid-cols-2 max-[767px]:gap-4 items-center gap-2 md:flex">
      {assignmentTimeLine.map((timeLine) => (
        <li
          onClick={() => setShowAssignments(timeLine.label)}
          key={timeLine.id}
          className={`border border-gray-200 rounded-md p-2 cursor-pointer transition-all duration-200 ease-in-out hover:bg-[#2394db] hover:text-white hover:shadow-md hover:scale-[1.02] active:scale-[0.98] active:shadow-sm ${
            showAssignments === timeLine.label
              ? "bg-[#2394db] text-white shadow-md"
              : "bg-white text-gray-700"
          } `}
        >
          {timeLine.label}
          <span className="font-Montserrat-Bold px-2">{timeLine.number}</span>
        </li>
      ))}
    </ul>
  );
};

export default AssignmentFilterBar;
