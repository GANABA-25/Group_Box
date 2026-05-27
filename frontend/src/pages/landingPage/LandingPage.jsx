import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AnimationSates from "../../constants/AnimationSates";
import Button from "../../components/Button";
import StudentsComments from "./StudentsComments";
import Footer from "../../components/Footer";

import SemiCircle1 from "../../Images/SemiCircle1.svg";
import SemiCircle2 from "../../Images/SemiCircle2.svg";
import SemiCircle3 from "../../Images/SemiCircle3.svg";

import { FaBars } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { LuClock4 } from "react-icons/lu";
import { VscBellDot } from "react-icons/vsc";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const features = [
  {
    id: 1,
    color: "#d7fee1",
    iconColor: "#4eef79",
    icon: <LuNotepadText />,
    tittle: "Task Assignment & Tracking",
    description: (
      <>
        Easily Create, Assign, and Track For <br className="hidden md:block" />
        Every Group Member Ensuring Nothing <br className="hidden md:block" />
        Falls Through The Crack
      </>
    ),
  },
  {
    id: 2,
    color: "#fefdd7",
    iconColor: "#f8f34f",
    icon: <LuClock4 />,
    tittle: "Real-Time Collaboration",
    description: (
      <>
        Share updates, Comments, And Fills With
        <br className="hidden md:block" />
        Your Team, Keeping Everyone Connected
        <br className="hidden md:block" />
        And Aligned
      </>
    ),
  },
  {
    id: 3,
    color: "#d7e7fe",
    iconColor: "#94c0ff",
    icon: <VscBellDot />,
    tittle: "Deadline Reminders & Notifications",
    description: (
      <>
        Stay on Track With Automatic Reminders
        <br className="hidden md:block" />
        For Upcoming Deadline And Tasks
      </>
    ),
  },
];

const LandingPage = () => {
  const [swiperInstance, setSwiperInstance] = useState(null);
  const navigate = useNavigate();

  const goToNextSlide = () => {
    if (swiperInstance) swiperInstance.slideNext();
  };

  const goToPrevSlide = () => {
    if (swiperInstance) swiperInstance.slidePrev();
  };

  return (
    <div>
      <header className="fixed w-full top-0 z-100 max-[767px]:p-4 md:p-6 lg:p-3 bg-white border-b border-gray-300">
        <div className="flex justify-between items-center">
          <motion.div
            initial={AnimationSates.NegativeHiddenAnimationSate}
            animate={{ opacity: 1, x: 0 }}
            transition={AnimationSates.duration}
            className="flex justify-center items-center gap-2"
          >
            <img
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
              alt="GroupBox_Logo"
              className="w-[2rem] h-[2rem] shadow-xl"
            />
            <h1 className="max-[767px]:text-lg font-Montserrat-ExtraBold">
              <span className="text-[#2394db]">GroupBox</span> AIT
            </h1>
          </motion.div>

          <motion.div
            initial={AnimationSates.PositiveHiddenAnimationSateX}
            animate={{ opacity: 1, x: 0 }}
            transition={AnimationSates.duration}
            className="flex justify-center items-center max-[767px]:gap-3 md:gap-10"
          >
            <h1 className="hidden md:block cursor-pointer lg:hover:text-blue-500">
              Try Demo
            </h1>
            <h1 className="hidden md:block cursor-pointer lg:hover:text-blue-500">
              Pages
            </h1>
            <h1 className="hidden md:block cursor-pointer lg:hover:text-blue-500">
              About
            </h1>
            <Button
              onClick={() => navigate("/signin")}
              label="Sign in"
              bgColor="#2394db"
            />
            <FaBars className="text-blue-500 text-2xl md:hidden" />
          </motion.div>
        </div>
      </header>
      <div className="max-[767px]:w-[92%] w-[95%] m-auto font-Montserrat-Regular mt-20 md:mt-28 lg:mt-20">
        <main className="grid gap-12">
          <section className="relative bg-linear-to-r from-[#2394db] to-[#094065] text-white flex justify-between rounded-2xl shadow-xl">
            <motion.div
              initial={AnimationSates.NegativeHiddenAnimationSate}
              animate={{ opacity: 1, x: 0 }}
              transition={AnimationSates.duration}
              className="p-8 grid max-[767px]:gap-4 font-bold"
            >
              <div className="max-[767px]:grid max-[767px]:gap-4">
                <h1 className="max-[767px]:text-xl md:my-4 md:text-3xl lg:text-4xl">
                  GroupBox
                </h1>
                <p className="max-[767px]:text-[2rem] max-[767px]:leading-10 font-Montserrat-ExtraBold md:text-justify lg:tracking-wide md:text-[2.5rem] md:leading-13 lg:text-7xl lg:leading-20">
                  Smarter Group <br className="hidden lg:block" /> Work Starts
                  Here.
                </p>
              </div>
              <p className="max-[767px]:text-[0.6rem] text-justify max-[767px]:leading-4 tracking-wide md:text-xs lg:text-lg">
                Plan. Collaborate. And Evaluate - Group Box Brings <br />
                Structure And Fairness To Every Team Project at AIT
              </p>
              <div className="flex gap-2">
                <img
                  className="w-[2rem] h-[2rem]"
                  src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749588045/GroupBox/GroupBox_Logo_vi2zzr.png"
                  alt=" GroupBox_Logo"
                />
                <img
                  className="w-[2rem] h-[2rem]"
                  src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749752726/AIT_CREST_lkz7qf.png"
                  alt="ait_Logo"
                />
                {/* <Button
                  label="Sign in with AIT email"
                  bgColor="white"
                  textColor="black"
                /> */}
              </div>
            </motion.div>

            <motion.div
              initial={AnimationSates.PositiveHiddenAnimationSateX}
              animate={{ opacity: 1, x: 0 }}
              transition={AnimationSates.duration}
              className="hidden md:block relative"
            >
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute right-58 top-5 w-[3rem] h-[3rem] lg:w-[4rem] lg:h-[4rem] lg:top-6 lg:left-13"
                src={SemiCircle1}
                alt="circle"
              />
              <img
                className="relative lg:w-[30rem] lg:h-[30rem] md:w-full md:max-w-[30rem] md:h-auto z-50"
                src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749590776/GroupBox/Hero_ghl4gb.svg"
                alt="Hero_ghl4gb"
              />

              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute w-[3rem] h-[3rem] bottom-6 right-57 lg:w-[4rem] lg:h-[4rem] lg:bottom-12 lg:right-[22rem]"
                src={SemiCircle2}
                alt="circle"
              />
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="absolute top-30 right-0 w-[3rem] h-[3rem] lg:w-[4rem] lg:h-[4rem] lg:top-40"
                src={SemiCircle3}
                alt="circle"
              />
            </motion.div>
          </section>

          <section className="grid gap-8 ">
            <motion.div
              initial={AnimationSates.PositiveHiddenAnimationSateY}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={AnimationSates.duration}
              className="grid gap-4"
            >
              <h1 className="max-[767px]:text-[2rem] max-[767px]:leading-10 font-Montserrat-ExtraBold md:text-[2.5rem] md:leading-13 lg:text-6xl lg:leading-20 ">
                Everything <span className="text-[#2394db]">Your Group </span>
                Needs <br /> To Work Smarter
              </h1>
              <p className="max-[767px]:text-[0.9rem] max-[767px]:leading-6 tracking-wide md:text-xl">
                Stay Organized, Collaborate Better, And Track Your Teams's
                <br className="hidden md:block" />
                Progress - All In One Place.
              </p>
            </motion.div>

            <motion.div
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.4 } },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-3"
            >
              {features.map((data) => (
                <motion.div
                  key={data.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={AnimationSates.duration}
                  style={{ backgroundColor: data.color }}
                  className="rounded-2xl p-8 grid gap-15 shadow-xl md:p-16 lg:p-8"
                >
                  <div
                    style={{ backgroundColor: data.iconColor }}
                    className="rounded-full w-16 h-16 flex items-center justify-center text-3xl md:w-24 md:h-24 md:text-6xl lg:text-3xl lg:w-16 lg:h-16"
                  >
                    {data.icon}
                  </div>

                  <div className="grid gap-7">
                    <h1 className="font-Montserrat-Bold text-xl md:text-[2.5rem] lg:text-xl">
                      {data.tittle}
                    </h1>
                    <p className="text-justify md:text-xl lg:text-sm">
                      {data.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <motion.section
            initial={AnimationSates.PositiveHiddenAnimationSateY}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={AnimationSates.duration}
            className="flex gap-12 items-center flex-wrap"
          >
            <img
              className="hidden md:w-full lg:w-[40rem] shadow-xl lg:block"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749663913/GroupBox/Who_its_for_n45i1h.svg"
              alt="Who_its_for"
            />
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-Montserrat-ExtraBold">
                <span className="text-[#2394db]">Who</span> it's For
              </h1>
              <p className="text-base md:text-lg leading-relaxed">
                Group Box was Designed Specifically With AIT Students in Mind –
                Because <br /> We Know Group Work Isn't Always Easy.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                Whether You're Tackling a Semester-long Research Project{" "}
                <span className="text-[#4eef79] font-Montserrat-Bold">
                  or Managing Multiple Assignments with Different Teams,
                </span>{" "}
                Keeping Everyone Organized and Accountable Can Be a Real
                Challenge. That's Exactly <br />
                Why We Built Group Box.
              </p>
              <p className="text-base md:text-lg leading-relaxed">
                With Group Box, you get all the tools you need to{" "}
                <span className="text-[#2394db] font-Montserrat-Bold">
                  plan, communicate, and execute
                </span>{" "}
                group projects efficiently. <br />
                No more confusion about roles, deadlines, or progress — just
                smooth, collaborative work.
              </p>
            </div>
            <img
              className="md:w-full lg:w-[40rem] shadow-xl lg:hidden"
              src="https://res.cloudinary.com/dmdnq9vh8/image/upload/v1749663913/GroupBox/Who_its_for_n45i1h.svg"
              alt="Who_its_for"
            />
          </motion.section>
        </main>

        <section className="mt-[3rem]">
          <div className="flex justify-between items-start mb-[2rem]">
            <motion.div
              initial={AnimationSates.PositiveHiddenAnimationSateY}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={AnimationSates.duration}
              className="grid gap-4"
            >
              <h1 className="max-[767px]:text-4xl opacity-80 font-Montserrat-Bold md:text-4xl lg:text-5xl">
                What AIT Students Are Saying
              </h1>
              <p>
                Don't just take our word for it Hear From students who've used
                GroupBox
                <br className="md:hidden lg:block " />
                to make their group work easier. fairer, and stress free
              </p>
              <div className="flex justify-center items-center gap-5 md:hidden">
                <Button
                  onClick={goToPrevSlide}
                  label="Previous"
                  icon={<IoIosArrowBack />}
                  bgColor="#2394db"
                />
                <Button
                  onClick={goToNextSlide}
                  label="Next"
                  icon2={<IoIosArrowForward />}
                  bgColor="#2394db"
                />
              </div>
            </motion.div>

            <motion.div
              initial={AnimationSates.PositiveHiddenAnimationSateY}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={AnimationSates.duration}
              className="hidden gap-5 md:flex justify-center items-center"
            >
              <Button
                onClick={goToPrevSlide}
                label="Previous"
                icon={<IoIosArrowBack />}
                bgColor="#2394db"
              />
              <Button
                onClick={goToNextSlide}
                label="Next"
                icon2={<IoIosArrowForward />}
                bgColor="#2394db"
              />
            </motion.div>
          </div>
          <StudentsComments onSwiperInit={setSwiperInstance} />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;
