import { useState, useContext } from "react";
import { AuthContext } from "../../store/AuthContext";

import Header from "../../components/Header";
import Button from "../../components/Button";
import ProfileImageUpload from "../../components/settings/ProfileImageUpload";
import UpdatePersonalInformation from "../../components/settings/UpdatePersonalInformation";

import { CiEdit } from "react-icons/ci";
import { ImProfile } from "react-icons/im";
import { LuSettings2 } from "react-icons/lu";

const Settings = () => {
  const { userData } = useContext(AuthContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateInformationModalOpen, setIsUpdateInformationModalOpen] =
    useState(false);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  const openUpdateInformationModalHandler = () =>
    setIsUpdateInformationModalOpen(true);
  const closeUpdateInformationModalHandler = () =>
    setIsUpdateInformationModalOpen(false);

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular md:p-4 lg:p-0 lg:ml-[17%] lg:w-[83%] lg:pr-2">
      <Header title="Profile" icon1={<LuSettings2 />} icon2={<ImProfile />} />

      <section className="grid gap-8 max-[767px]:p-3 max-[767px]:mt-24 md:mt-32 lg:gap-6 mt-4 lg:mt-23">
        <section className="flex justify-between items-center border border-gray-300 p-4 shadow-md md:p-8 md:gap-8 lg:gap-6 lg:p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userData.profilePicture}
                alt="profile"
                className="w-20 h-20 rounded-full md:w-30 md:h-30 lg:w-20 lg:h-20"
              />
            </div>
            <div className="grid gap-1 md:gap-2 lg:gap-1">
              <h1 className="max-[767px]:text-[1rem] font-Montserrat-Bold text-[#2394db] md:text-2xl lg:text-[1rem]">
                {userData.userName}
              </h1>
              <p className="max-[767px]:text-sm md:text-xl lg:text-xs capitalize">
                {userData.role}
              </p>
              <h2 className="max-[767px]:text-sm md:text-xl lg:text-xs">
                Accra Institute of Technology
              </h2>
            </div>
          </div>
          <div>
            <Button
              bgColor="#2394db"
              label="Edit"
              icon2={<CiEdit />}
              onClick={openModalHandler}
            />
          </div>
        </section>

        <section className="grid gap-2 md:gap-4 lg:gap-2">
          <div className="flex justify-between items-center">
            <h1 className="max-[767px]:text-[1rem] font-Montserrat-Bold text-[#2394db] md:text-2xl lg:text-[1rem]">
              Personal Information
            </h1>
            <Button
              bgColor="#2394db"
              label="Edit"
              icon2={<CiEdit />}
              onClick={openUpdateInformationModalHandler}
            />
          </div>

          <div className="grid gap-4 grid-cols-2 border border-gray-300 p-4 shadow-md md:p-8 md:gap-8 lg:gap-6 lg:p-4 lg:grid-cols-3 ">
            <div className="grid gap-2">
              <h1 className="max-[767px]:text-[1rem] md:text-2xl lg:text-[1rem]">
                FULL NAME
              </h1>
              <p className="text-sm md:text-xl lg:text-xs">
                {userData.userName}
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className="max-[767px]:text-[1rem] md:text-2xl lg:text-[1rem]">
                STUDENT ID
              </h1>
              <p className="text-sm md:text-xl lg:text-xs capitalize">
                {userData.studentId}
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className="max-[767px]:text-[1rem] md:text-2xl lg:text-[1rem]">
                SCHOOL EMAIL
              </h1>
              <p className="text-sm md:text-xl lg:text-xs">
                {userData.schoolEmail}
              </p>
            </div>
            <div className="grid gap-2">
              <h1 className="max-[767px]:text-[1rem] md:text-2xl lg:text-[1rem]">
                PHONE NUMBER
              </h1>
              <p className="text-sm md:text-xl lg:text-xs">
                + {userData.phoneNumber}
              </p>
            </div>
          </div>
        </section>
      </section>

      <ProfileImageUpload open={isModalOpen} onClose={closeModalHandler} />
      <UpdatePersonalInformation
        open={isUpdateInformationModalOpen}
        onClose={closeUpdateInformationModalHandler}
      />
    </div>
  );
};

export default Settings;
