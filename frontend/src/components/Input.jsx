import { Link } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  forgetPassword,
  hasError,
  isLoading,
  showPassword,
  onTogglePassword,
  forStudents,
  max,
}) => {
  return (
    <div className="relative grid gap-3 font-Montserrat-Regular">
      <span className="max-[767px]:text-[0.8rem] flex justify-between lg:text-[0.8rem]">
        <label className="font-Montserrat-Bold">{label}</label>
        <label className="font-Montserrat-Bold">{forStudents}</label>
        {forgetPassword && (
          <Link
            to="/password-reset-verification"
            className="text-[#2394db] hover:text-black cursor-pointer"
          >
            {forgetPassword}
          </Link>
        )}
      </span>
      <div className="relative">
        <input
          className={`w-full bg-grayDark rounded-sm border border-gray-300 p-2 md:p-4 lg:p-2 focus:outline-none focus:ring-2 focus:ring-[#2394db] focus:ring-opacity-30 ${
            hasError
              ? "focus:ring-1 focus:ring-red-600 border-2 border-red-600"
              : "border-gray-300"
          }`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={isLoading}
          max={max}
        />
        {(type === "password" || name?.toLowerCase()?.includes("password")) && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#2394db] cursor-pointer"
            // disabled={isLoading}
          >
            {showPassword ? (
              <IoEye className="w-5 h-5" />
            ) : (
              <IoEyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
