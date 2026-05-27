const AssociatedStudentGroups = ({ data }) => {
  return (
    <div className="grid gap-2">
      <div className="font-Montserrat-Regular border border-gray-200 p-2 rounded-xl shadow-md grid gap-2">
        <div className="flex justify-between items-center">
          <h1 className=" font-Montserrat-Bold">{data.groupName}</h1>
          {data.isActive ? (
            <p className="text-sm bg-green-400 p-1 px-3 rounded-md text-white">
              Active
            </p>
          ) : (
            <p className="text-sm bg-red-600 p-1 px-3 rounded-md text-white">
              No
            </p>
          )}
        </div>
        <p className="text-xs">{data.description}</p>

        <div className="flex justify-between items-center border border-gray-100 p-1 rounded-md">
          <h1 className="font-Montserrat-Bold text-sm">GroupCode </h1>
          <p className="text-xs">{data.groupCode}</p>
        </div>

        <div className="flex flex-col gap-2">
          {data.memberCount > 0 && (
            <div className="flex gap-2">
              <h1 className="font-Montserrat-Bold">Members</h1>
              <p>{data.memberCount}</p>
            </div>
          )}

          <div className="grid max-[767px]:grid-col grid-cols-2 gap-2">
            {data.members?.map((member) => (
              <div
                key={member._id}
                className="flex items-center gap-2 bg-gray-100 p-2 rounded-md"
              >
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={member.profilePicture}
                  alt="profile"
                />
                <div className="flex flex-col gap-1">
                  <h1 className="text-xs font-Montserrat-Bold">
                    {member.fullName}
                  </h1>
                  <p className="text-[0.6rem]">{member.schoolEmail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssociatedStudentGroups;
