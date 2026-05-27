import { motion } from "framer-motion";
import AnimationSates from "../constants/AnimationSates";
import { useNavigate } from "react-router-dom";

import Button from "./Button";

import { FaHandshakeSimple } from "react-icons/fa6";
import { AiOutlineTwitter } from "react-icons/ai";
import { FaFacebookF } from "react-icons/fa";
import { SiInstagram } from "react-icons/si";
import { IoLogoGithub } from "react-icons/io";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={AnimationSates.PositiveHiddenAnimationSateY}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={AnimationSates.duration}
      className="font-Montserrat-Regular mt-[4rem]"
    >
      <div className="relative max-[767px]:w-[92%] flex justify-between items-center py-4 w-[95%] m-auto md:py-2">
        <div className="flex gap-2">
          <h1 className="font-Montserrat-Bold max-[767px]:text-lg text-2xl">
            <span className="text-3xl max-[767px]:text-xl">
              GroupBox - Making
            </span>
            <br />
            Group Work Work
          </h1>
          <FaHandshakeSimple className="absolute max-[767px]:left-44 max-[767px]:top-8 left-[15rem] top-9 text-yellow-300 text-5xl" />
        </div>
        <div>
          <Button
            onClick={() => navigate("/signin")}
            label="Sign in"
            bgColor="#2394db"
          />
        </div>
      </div>

      <div className="border-t border-gray-300">
        <div className="max-[767px]:grid max-[767px]:text-center max-[767px]:gap-10 md:flex gap-62 max-[767px]:w-[92%] w-[95%] m-auto py-8">
          <div className="grid gap-6 md:gap-4">
            <h1 className="font-Montserrat-ExtraBold">About Us</h1>
            <p className="text-sm">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              <br /> Voluptate animi quis mollitia incidunt reprehenderit
              quaerat
              <br />
              et eum assumenda totam quae!
            </p>
            <div className="flex max-[767px]:justify-center gap-4">
              <AiOutlineTwitter className="text-xl lg:hover:text-[#2394db] cursor-pointer" />
              <FaFacebookF className="text-xl lg:hover:text-[#2394db] cursor-pointer" />
              <SiInstagram className="text-xl lg:hover:text-[#2394db] cursor-pointer" />
              <IoLogoGithub className="text-xl lg:hover:text-[#2394db] cursor-pointer" />
            </div>
          </div>

          <div>
            <ul className="grid gap-4">
              <li className="lg:hover:text-[#2394db] cursor-pointer">Home</li>
              <li className="lg:hover:text-[#2394db] cursor-pointer">
                Features
              </li>
              <li className="lg:hover:text-[#2394db] cursor-pointer">
                About Us
              </li>
              <li className="lg:hover:text-[#2394db] cursor-pointer">
                Contact
              </li>
            </ul>
          </div>

          <div>
            <ul className="grid gap-4">
              <li className="lg:hover:text-[#2394db] cursor-pointer">
                Privacy Policy
              </li>
              <li className="lg:hover:text-[#2394db] cursor-pointer">
                Terms of Use
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Footer;
