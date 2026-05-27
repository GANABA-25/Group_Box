const Button_2 = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 md:gap-3 px-3 lg:px-6 py-3 md:px-8 md:py-4 lg:py-3 bg-gradient-to-r from-[#2394db] to-[#1c6ba0] lg:hover:from-[#1c6ba0] lg:hover:to-[#2394db] rounded-lg text-white font-medium transition-all duration-300 shadow-sm lg:hover:shadow-xl active:scale-95 cursor-pointer"
    >
      <div className="text-lg md:text-xl">{icon}</div>
      <span className="font-Montserrat-Bold text-xs md:text-base tracking-wide">
        {label}
      </span>
    </button>
  );
};

export default Button_2;
