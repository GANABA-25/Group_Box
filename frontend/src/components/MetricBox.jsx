import { motion } from "framer-motion";

const MetricBox = ({ title, icon, totalGroups, text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
        hover: { duration: 0.2 },
      }}
      className="font-Montserrat-Regular grid gap-2 border border-gray-200 p-4 rounded-xl shadow-md bg-white cursor-pointer"
    >
      <div className="flex justify-between gap-32 items-center">
        <motion.h1 whileHover={{ scale: 1.02 }} className="origin-left">
          {title}
        </motion.h1>
        <motion.div
          className="text-blue-600 text-2xl"
          whileHover={{ rotate: 10 }}
        >
          {icon}
        </motion.div>
      </div>
      <motion.p
        className="font-Montserrat-Bold text-2xl"
        whileHover={{ scale: 1.05 }}
      >
        {totalGroups}
      </motion.p>
      <motion.p className="text-xs text-green-600" whileHover={{ x: 5 }}>
        {text}
      </motion.p>
    </motion.div>
  );
};

export default MetricBox;
