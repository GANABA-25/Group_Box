import { useContext, useState } from "react";
import { GroupContext } from "../../store/GroupContext.jsx";

import EmptyContent from "../../components/EmptyContent.jsx";
import CreateGroup from "../../features/createGroup/CreateGroup.jsx";
import JoinGroupModal from "../../features/JoinGroup/JoinGroupModal.jsx";
import Button_2 from "../../components/Button_2.jsx";
import GroupCard from "../../components/GroupCard.jsx";

import Header from "../../components/Header.jsx";
import { IoMdAdd } from "react-icons/io";
import { MdOutlineGroupAdd } from "react-icons/md";
import { GrScorecard } from "react-icons/gr";
import { MdMessage, MdGroups3 } from "react-icons/md";

const Groups = () => {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const { groupData, isLoading } = useContext(GroupContext);

  const openCreateModalHandler = () => setCreateModalOpen(true);
  const closeCreateModalHandler = () => setCreateModalOpen(false);
  const openJoinModalOpenHandler = () => setJoinModalOpen(true);
  const closeJoinModalOpenHandler = () => setJoinModalOpen(false);

  return (
    <div className="min-h-screen overflow-auto lg:ml-[17%] lg:w-[83%]">
      <Header title="Group Dashboard" icon2={<MdGroups3 />} />
      <div className="px-3 max-[767px]:mt-28 grid gap-4 md:mt-36 lg:px-0 lg:pr-2 lg:mt-24">
        <div className="grid grid-cols-2 lg:flex items-center gap-4">
          <Button_2
            label="Create Group"
            icon={<IoMdAdd />}
            onClick={openCreateModalHandler}
          />
          <Button_2
            label="Join Group"
            icon={<MdOutlineGroupAdd />}
            onClick={openJoinModalOpenHandler}
          />

          <Button_2 label="View Peer score" icon={<GrScorecard />} />
          <Button_2 label="Discussions" icon={<MdMessage />} />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center max-[767px]:min-h-[40vh] md:min-h-[70vh]">
            <img
              className="w-20 h-20"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758788158/GroupBox/Loading_lhitxj.svg"
              alt="loading"
            />
          </div>
        ) : (
          <div>
            {groupData?.length > 0 ? (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupData.map((data) => (
                  <GroupCard key={data._id} data={data} />
                ))}
              </section>
            ) : (
              <>
                <EmptyContent
                  imageUri="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1758789323/GroupBox/No_Group_izd0v9.svg"
                  description="You haven’t created or joined any groups yet. Once you do, your groups will appear here."
                />
              </>
            )}
          </div>
        )}
      </div>
      <CreateGroup open={createModalOpen} onClose={closeCreateModalHandler} />
      <JoinGroupModal
        open={joinModalOpen}
        onClose={closeJoinModalOpenHandler}
      />
    </div>
  );
};

export default Groups;
