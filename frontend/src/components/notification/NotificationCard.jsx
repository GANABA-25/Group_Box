import { formatDistanceToNow } from "date-fns";
import { useContext } from "react";
import { NotificationContext } from "../../store/NotificationContext";

const NotificationCard = ({ data, onClick }) => {
  const { setReplyData } = useContext(NotificationContext);

  const { senderName, senderGroupCode, message, date, receiverGroupName } =
    data;

  const timeAgo = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });

  const replyMessageHandler = () => {
    setReplyData({
      senderName,
      senderGroupCode,
      message,
      timeAgo,
      receiverGroupName,
    });
  };
  return (
    <div className="flex items-center gap-3 border-b-1 border-gray-300 py-4">
      <div className="grid gap-1">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <img
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg"
              alt="student"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="font-Montserrat-Bold">{senderName}</h1>
          </div>
          <div className=" flex items-center gap-2">
            <p>{timeAgo}</p>
            <div className=" bg-red-600 w-3 h-3 rounded-full" />
          </div>
        </div>

        <div className="flex justify-between">
          <h5 className=" text-blue-600">Left a comment</h5>
          <h5 className=" text-blue-600 font-Montserrat-Bold">
            {receiverGroupName}
          </h5>
        </div>
        <p>{message}</p>

        <div>
          <button
            onClick={() => {
              replyMessageHandler();
              if (onClick) onClick();
            }}
            className="lg:hidden flex items-center justify-center gap-2 md:gap-3 px-3 lg:px-6 py-3 md:px-4 md:py-1 bg-gradient-to-r from-[#2394db] to-[#1c6ba0] lg:hover:from-[#1c6ba0] lg:hover:to-[#2394db] rounded-lg text-white font-medium transition-all duration-300 shadow-sm lg:hover:shadow-xl active:scale-95 cursor-pointer"
          >
            Reply
          </button>
          <button
            onClick={replyMessageHandler}
            className="hidden lg:flex items-center justify-center gap-2 md:gap-3 px-3 lg:px-6 py-3 md:px-4 md:py-1 bg-gradient-to-r from-[#2394db] to-[#1c6ba0] lg:hover:from-[#1c6ba0] lg:hover:to-[#2394db] rounded-lg text-white font-medium transition-all duration-300 shadow-sm lg:hover:shadow-xl active:scale-95 cursor-pointer"
          >
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
