import { useContext, useState, useEffect } from "react";

import ModalCmp from "../ModalCmp";
import { NotificationContext } from "../../store/NotificationContext";
import { AuthContext } from "../../store/AuthContext";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import FeedbackMessage from "../FeedbackMessage";
import Button from "../Button";

import { ImCancelCircle } from "react-icons/im";

const ReplyNotifications = ({ open, onClose }) => {
  const { replyData } = useContext(NotificationContext);

  const { userData } = useContext(AuthContext);

  const [replyMessage, setReplyMessage] = useState({ message: "" });

  useEffect(() => {
    if (replyData) {
      setReplyMessage({
        message: "",
        receiverCode: replyData.senderGroupCode,
        senderGroup: replyData.receiverGroupName,
        schoolEmail: userData?.schoolEmail || "",
      });
    }
  }, [replyData, userData]);

  const inputChangeHandler = (e) => {
    setReplyMessage((prev) => ({ ...prev, message: e.target.value }));
  };

  const disableButton = replyMessage.message === "";
  const isSmallScreen = window.innerWidth < 640;

  const {
    isLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const replyHandler = (e) => {
    e.preventDefault();

    if (!replyMessage.message.trim()) {
      return;
    }

    postData(import.meta.env.VITE_REPLY_NOTIFICATION_URI, replyMessage);
  };

  useEffect(() => {
    if (postResponse) {
      const timeOutId = setTimeout(() => {
        setPostResponse(null);
      }, 3000);

      return () => clearTimeout(timeOutId);
    }

    if (errorMsg) {
      const timeOutId = setTimeout(() => {
        setErrorMsg(null);
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [postResponse, errorMsg]);

  return (
    <>
      <ModalCmp open={open} onClose={onClose}>
        <ImCancelCircle
          onClick={onClose}
          className="float-end text-[#2394db] text-xl md:text-2xl"
        />
        <form
          onSubmit={replyHandler}
          className="lg:hidden max-[767px]:w-[21rem] md:w-[35rem]"
        >
          <div className="bg-gray-50 p-4 grid gap-2 md:gap-3">
            <h1 className="max-[767px]:text-xl text-center font-Montserrat-Bold text-2xl">
              Reply Section
            </h1>

            {errorMsg?.message && (
              <div className="flex justify-center items-center p-4">
                <FeedbackMessage errorMessage={errorMsg.message} />
              </div>
            )}

            {postResponse?.data.message && (
              <div className="flex justify-center items-center p-4">
                <FeedbackMessage successMsg={postResponse.data.message} />
              </div>
            )}

            <div className="flex justify-center items-center gap-4 md:text-xl">
              <h1>Reply to</h1>
              <span className="font-Montserrat-Bold">
                {replyData?.senderName}
              </span>
            </div>

            <div className="grid gap-2 mb-3 text-xs md:text-xl">
              <p className="font-semibold">Comment</p>
              <p className="text-gray-600">{replyData?.message}</p>
            </div>

            <div className="grid gap-2">
              <h1 className="font-semibold text-sm mb-1 md:text-xl">Reply</h1>
              <textarea
                rows={isSmallScreen ? 3 : 6}
                className="border border-[#2394db] focus:outline-none focus:ring-2 focus:ring-[#1c6ba0] p-3 w-full rounded-md text-sm resize-none"
                placeholder="Type your reply..."
                value={replyMessage?.message}
                onChange={inputChangeHandler}
                required
              />
              <div className="flex justify-center mt-3">
                <Button
                  bgColor="#2394db"
                  label="Reply"
                  isLoading={isLoading}
                  disableButton={disableButton}
                />
              </div>
            </div>
          </div>
        </form>
      </ModalCmp>

      <form onSubmit={replyHandler} className="hidden lg:block w-1/2 pl-4">
        <div className="bg-gray-50 p-4 shadow-sm grid gap-2">
          <h1 className="text-center font-Montserrat-Bold text-2xl mb-2">
            Reply Section
          </h1>

          {errorMsg?.message && (
            <div className="flex justify-center items-center p-4">
              <FeedbackMessage errorMessage={errorMsg.message} />
            </div>
          )}

          {postResponse?.data.message && (
            <div className="flex justify-center items-center p-4">
              <FeedbackMessage successMsg={postResponse.data.message} />
            </div>
          )}

          <div className="flex justify-center items-center gap-4">
            <h1 className="">Reply to</h1>
            <span className="font-Montserrat-Bold">
              {replyData?.senderName}
            </span>
          </div>

          <div className="mb-3 text-sm grid gap-2">
            <p className="font-semibold">Comment</p>
            <p className="text-gray-600">{replyData?.message}</p>
          </div>

          <div className="grid gap-2">
            <h1 className="font-semibold text-sm mb-1">Reply</h1>
            <textarea
              rows={5}
              className="border border-[#2394db] focus:outline-none focus:ring-2 focus:ring-[#1c6ba0] p-3 w-full rounded-md text-sm resize-none"
              placeholder="Type your reply..."
              value={replyMessage.message}
              onChange={inputChangeHandler}
              required
            />
            <div className="flex justify-center mt-3">
              <Button
                bgColor="#2394db"
                label="Reply"
                isLoading={isLoading}
                disableButton={disableButton}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default ReplyNotifications;
