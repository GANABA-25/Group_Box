import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";
import Lottie from "lottie-react";

import loadingAnimation from "../lottie/formLoadingAnimation.json";

const Button = ({
  buttonType,
  onClick,
  label,
  icon,
  icon2,
  bgColor,
  textColor = "white",
  disableButton,
  isLoading,
}) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  return (
    <motion.button
      type={buttonType}
      style={{ backgroundColor: bgColor, color: textColor }}
      whileHover={
        isLargeScreen ? { scale: 1.1, backgroundColor: "#1c7cb7" } : {}
      }
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      disabled={disableButton}
      className={`flex justify-center items-center font-Montserrat-Regular text-[1rem] md:text-2xl lg:text-xl text-white p-2 px-4 rounded-sm ${
        disableButton
          ? "opacity-50 cursor-not-allowed"
          : "opacity-100 lg:cursor-pointer"
      }`}
    >
      {isLoading ? (
        <div className="flex justify-center ">
          <Lottie
            className="w-[4.5rem] lg:w-[4.5rem]"
            animationData={loadingAnimation}
            loop={true}
          />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          {icon}
          {label}
          {icon2}
        </div>
      )}
    </motion.button>
  );
};

export default Button;
