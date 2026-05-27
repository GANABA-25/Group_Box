const EmptyContent = ({ imageUri, description }) => {
  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="flex flex-col items-center text-center gap-10">
        <img
          className="w-[22rem] max-w-full md:w-[28rem] lg:w-[30rem]"
          src={imageUri}
          alt="no assignment"
        />

        <p className="text-gray-500 max-w-md">{description}</p>
      </div>
    </div>
  );
};

export default EmptyContent;
