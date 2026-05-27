import { useState, useEffect, useContext } from "react";
import { usePost } from "../../hooks/usePost";
import { postUri } from "../../../http";

import FeedbackMessage from "../../components/FeedbackMessage";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Header from "../../components/Header";

import { AuthContext } from "../../store/AuthContext";
import { GroupContext } from "../../store/GroupContext";

import { BsSendArrowUpFill } from "react-icons/bs";
import { GrContactInfo } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";
import { BsFillSendArrowUpFill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { MdOutlineGroupAdd } from "react-icons/md";

const SendNotification = () => {
  const { userData } = useContext(AuthContext);
  const { groupData } = useContext(GroupContext);

  const [notificationMessage, setNotificationMessage] = useState({
    message: "",
    schoolEmail: userData?.schoolEmail,
    studentGroupCode: "",
  });

  const inputChangeHandler = (inputIdentifier, enteredValue) => {
    setNotificationMessage((prevState) => {
      return { ...prevState, [inputIdentifier]: enteredValue };
    });

    // setErrorMsg((prevErrors) => ({
    //   ...prevErrors,
    //   [inputIdentifier]: "",
    // }));
  };

  const disableButton =
    notificationMessage.message === "" || notificationMessage.groupCode === "";

  const {
    isLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  } = usePost(postUri);

  const sendNotificationHandler = (e) => {
    e.preventDefault();
    postData(import.meta.env.VITE_NOTIFICATION_URI, notificationMessage);
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
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%]">
      <div className="bg-[#2394db] p-4 text-white flex flex-col gap-2 lg:rounded-b-md">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100/20 p-2 text-2xl rounded-md">
            <BsFillSendArrowUpFill />
          </div>
          <h1 className="text-2xl font-Montserrat-Bold">Send Notification</h1>
        </div>
        <p className="text-sm">Send messages to your connected groups</p>
      </div>

      <div className="flex items-center gap-2 m-4 md:my-6 lg:my-8">
        <FaUserGroup className="text-[#2394db] text-2xl" />
        <h1 className="font-Montserrat-Bold md:text-2xl">
          Lists of Connected Groups
        </h1>
      </div>
      <section className="grid gap-3 px-3 lg:px-0 lg:pr-2 lg:mt-8">
        <form onSubmit={sendNotificationHandler}>
          <div className="lg:mb-4">
            {userData.role === "student" && (
              <div className="grid grid-cols-3 gap-3">
                {groupData.map((data, index) => (
                  <div
                    key={index}
                    className="border border-[#2394db] p-4 shadow-md"
                  >
                    <h1>{data.groupName}</h1>
                    <div className="flex gap-3">
                      <div className="flex gap-2">
                        <h1>Members</h1>
                        <p>{data.memberCount}</p>
                      </div>
                      <div className="flex gap-2">
                        <h1 className=" font-Montserrat-Bold">GROUP CODE</h1>
                        <p className="text-red-600">{data.groupCode}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {userData.role === "lecturer" && (
              <div className="grid max-[767px]:grid-cols-1 md:grid-cols-3 gap-3">
                {groupData[0]?.studentGroups?.map((data, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 p-4 shadow-md rounded-md"
                  >
                    <div className="border-b border-gray-200 py-2">
                      <h1 className="font-Montserrat-Bold">{data.groupName}</h1>
                    </div>
                    <div className="flex justify-between items-center gap-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2394db] text-white p-2 text-sm rounded-md">
                          <MdOutlineGroupAdd />
                        </div>
                        <div className="text-xs">
                          <h1>Members</h1>
                          <p className="font-Montserrat-Bold">
                            {data.memberCount}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2394db] text-white p-2 text-sm rounded-md">
                          #
                        </div>
                        <div className="text-xs">
                          <h1 className="">GROUP CODE</h1>
                          <p className="text-[#2394db] font-Montserrat-Bold">
                            {data.groupCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-center items-center p-4">
            {errorMsg?.message && (
              <FeedbackMessage errorMessage={errorMsg.message} />
            )}

            {postResponse?.data.message && (
              <FeedbackMessage successMsg={postResponse.data.message} />
            )}
          </div>
          <div className="flex flex-col gap-4 border border-gray-200 p-4 rounded-md shadow-md">
            <div className="flex items-center gap-2 md:text-2xl">
              <BsFillSendArrowUpFill className="text-[#2394db]" />
              <h1 className="font-Montserrat-Bold">Compose Message</h1>
            </div>
            <div className="grid gap-3">
              <div className="w-50">
                <Input
                  label="Group Code"
                  placeholder="Enter the Group Code"
                  name="studentGroupCode"
                  type="text"
                  onChange={(e) =>
                    inputChangeHandler("studentGroupCode", e.target.value)
                  }
                />
              </div>
              <p className="text-xs text-gray-500">
                Enter the code of the group you want to send the message to
              </p>
              <label className="block text-sm font-semibold mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={notificationMessage.message}
                onChange={(e) => inputChangeHandler("message", e.target.value)}
                className="border border-[#2394db] focus:ring-2 focus:ring-[#1c6ba0] p-3 w-full rounded-md text-sm resize-none"
                placeholder="Type your message here..."
              />
              <p className="text-xs text-gray-500">
                Write a clear and concise message for your group
              </p>
              <div className="text-xs text-gray-500 text-right">
                {notificationMessage.message.length}/500
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                bgColor="#2394db"
                label="Send Notification"
                icon={<BsSendArrowUpFill />}
                isLoading={isLoading}
                disableButton={disableButton}
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default SendNotification;
