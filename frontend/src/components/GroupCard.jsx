import Button_2 from "./Button_2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../store/AuthContext";

import ProgressBar from "./charts/ProgressBar";

const GroupCard = ({ data }) => {
  const { userData } = useContext(AuthContext);
  const {
    _id,
    groupName,
    description,
    memberCount,
    studentGroups,
    taskCompleted,
    groupPercentage,
    groupCode,
  } = data;
  const navigate = useNavigate();
  return (
    <div className="grid gap-2">
      <div className="font-Montserrat-Regular border border-gray-200 p-2 rounded-xl shadow-md grid gap-2">
        <h1 className=" font-Montserrat-Bold">{groupName}</h1>
        <p className="text-xs">{description}</p>

        {taskCompleted != null && (
          <>
            <div className="flex justify-between">
              <h1 className=" font-Montserrat-Bold">Task Completed</h1>
              <h1>{taskCompleted}%</h1>
            </div>

            <ProgressBar
              value={groupPercentage}
              max={100}
              variant="success"
              label={groupPercentage}
            />
          </>
        )}

        {userData?.role === "student" && (
          <Button_2
            onClick={() =>
              navigate("/groupWorkSpace", {
                state: { payload: data },
              })
            }
            label="Enter Group"
            bgColor="#2394db"
          />
        )}

        {userData?.role === "lecturer" && (
          <Button_2
            onClick={() =>
              navigate("/lecturerWorkingSpace", {
                state: { payload: data },
              })
            }
            label="Enter Group"
            bgColor="#2394db"
          />
        )}
      </div>
      <div className="flex justify-between  items-center border border-gray-300 p-2 rounded-xl shadow-md">
        {memberCount > 0 && (
          <div className="flex gap-2">
            <h1 className="font-Montserrat-Bold">Members</h1>
            <p>{memberCount}</p>
          </div>
        )}

        {studentGroups?.length >= 0 && (
          <div className="flex gap-2">
            <h1 className="font-Montserrat-Bold">Groups</h1>
            <p>{studentGroups.length} </p>
          </div>
        )}

        <div className="flex gap-2">
          <h1 className="font-Montserrat-Bold">GroupCode :</h1>
          <p>{groupCode}</p>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
