import { useState, useContext } from "react";
import ModalCmp from "../ModalCmp";
import Button_2 from "../../components/Button_2";
import Button from "../Button";
import { AuthContext } from "../../store/AuthContext";
import Input from "../Input";
import FormError from "../FormError";

const PeerEvaluationModal = ({
  open,
  onClose,
  members,
  onSubmit,
  isLoading,
}) => {
  const [scores, setScores] = useState({});
  const [assignmentId, setAssignmentId] = useState("");
  const [errorMsg, setErrorMsg] = useState({});
  const { userData } = useContext(AuthContext);

  const handleScoreChange = (schoolEmail, value) => {
    setScores((prev) => ({
      ...prev,
      [schoolEmail]: Number(value),
    }));
  };

  const inputChangeHandler = (value) => {
    setAssignmentId(value);
    setErrorMsg((prev) => ({ ...prev, assignmentId: "" }));
  };

  const handleSubmit = () => {
    let hasError = false;

    if (!assignmentId.trim()) {
      setErrorMsg((prev) => ({
        ...prev,
        assignmentId: "Assignment ID is required",
      }));
      hasError = true;
    }

    if (hasError) return;

    onSubmit({
      assignmentId,
      scores,
    });
  };

  const filteredMembers = members.filter(
    (m) => m.schoolEmail !== userData?.schoolEmail
  );

  return (
    <ModalCmp open={open} onClose={onClose}>
      <div className="p-6 grid gap-6">
        <h1 className="text-xl font-bold">Peer Evaluation</h1>
        <p className="text-sm text-gray-600">
          Rate your teammates based on collaboration, contribution,
          communication and work quality.
          <br />
          <span className="font-semibold">Your ratings are anonymous.</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.schoolEmail}
              className="flex justify-between items-center border border-gray-300 p-3 rounded-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={member.profilePicture}
                  className="w-10 h-10 rounded-full"
                  alt={member.fullName}
                />
                <div>
                  <h1 className="text-sm font-bold">{member.fullName}</h1>
                  <p className="text-xs">Evaluate this member</p>
                </div>
              </div>

              <select
                className="border border-gray-300 p-2 rounded-md"
                value={scores[member.schoolEmail] || ""}
                onChange={(e) =>
                  handleScoreChange(member.schoolEmail, e.target.value)
                }
              >
                <option value="">Select score</option>
                <option value="1">1 - Poor</option>
                <option value="2">2 - Fair</option>
                <option value="3">3 - Good</option>
                <option value="4">4 - Very Good</option>
                <option value="5">5 - Excellent</option>
              </select>
            </div>
          ))}
        </div>

        {/* Assignment ID */}
        <Input
          label="Assignment ID"
          name="assignmentId"
          type="text"
          value={assignmentId}
          hasError={!!errorMsg.assignmentId}
          onChange={(e) => inputChangeHandler(e.target.value)}
          placeholder="Paste assignment ID here"
        />
        <FormError message={errorMsg.assignmentId} />

        <Button
          label="Submit Evaluation"
          bgColor="#2394db"
          isLoading={isLoading}
          onClick={handleSubmit}
        />
      </div>
    </ModalCmp>
  );
};

export default PeerEvaluationModal;
