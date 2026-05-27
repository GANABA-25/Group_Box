import { MdErrorOutline, MdCheckCircle } from "react-icons/md";

const FeedbackMessage = ({ errorMessage, successMsg }) => {
  const isError = Boolean(errorMessage);
  const message = isError ? errorMessage : successMsg;

  const icon = isError ? (
    <MdErrorOutline className="text-2xl text-red-500 shrink-0" />
  ) : (
    <MdCheckCircle className="text-2xl text-green-500 shrink-0" />
  );

  const title = isError ? "Something went wrong" : "Success";
  const containerStyle = isError
    ? "bg-red-50 border border-red-200 text-red-800"
    : "bg-green-50 border border-green-200 text-green-800";

  if (!message) return null;

  return (
    <div
      className={`w-full flex items-start gap-3 p-4 rounded-2xl shadow-md ${containerStyle}`}
    >
      {icon}
      <div className="space-y-1">
        <p className="font-semibold text-base">{title}</p>
        <p className="text-sm leading-snug">{message}</p>
      </div>
    </div>
  );
};

export default FeedbackMessage;
