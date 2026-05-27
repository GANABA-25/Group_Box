const Card = ({ icon, title, children }) => {
  return (
    <div className="grid gap-4 p-4 border border-gray-200 font-Montserrat-Regular w-full rounded-xl shadow-sm">
      <div className="flex items-center gap-2 text-2xl">
        <div className="text-orange-300">{icon}</div>
        <h1 className=" font-Montserrat-Bold">{title}</h1>
      </div>

      <div className="grid gap-2">{children}</div>
    </div>
  );
};

export default Card;
