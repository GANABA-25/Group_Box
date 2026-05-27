import { useState, useContext } from "react";

import { NotificationContext } from "../../store/NotificationContext";

import Header from "../../components/Header";

import NotificationCard from "../../components/notification/NotificationCard";
import ReplyNotifications from "../../components/notification/ReplyNotifications";
import EmptyContent from "../../components/EmptyContent";

import { GrContactInfo } from "react-icons/gr";
import { AiFillNotification } from "react-icons/ai";

const Notifications = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { groupNotifications, isLoading } = useContext(NotificationContext);

  const openModalHandler = () => setIsModalOpen(true);
  const closeModalHandler = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen overflow-auto font-Montserrat-Regular lg:ml-[17%]">
      <Header
        title="Notifications Center"
        icon1={<GrContactInfo />}
        icon2={<AiFillNotification />}
      />

      <section className="max-[767px]:mt-26 grid gap-3 px-3 md:mt-34 lg:px-0 lg:pr-2 lg:mt-22">
        {isLoading ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : (
          <>
            {groupNotifications.length === 0 ? (
              <EmptyContent
                imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758792764/GroupBox/No_notification_txoqub.svg"
                description="You don’t have any notifications at the moment. When there’s something new, it will appear here."
              />
            ) : (
              <section className="lg:flex">
                <div className="lg:w-1/2 lg:pr-4">
                  <div className="flex flex-col gap-4">
                    {groupNotifications.map((data, index) => (
                      <NotificationCard
                        key={index}
                        data={data}
                        onClick={openModalHandler}
                      />
                    ))}
                  </div>
                </div>

                <ReplyNotifications
                  open={isModalOpen}
                  onClose={closeModalHandler}
                />
              </section>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Notifications;
