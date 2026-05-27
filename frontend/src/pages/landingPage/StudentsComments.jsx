import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaStar, FaRegStarHalfStroke } from "react-icons/fa6";
import { motion } from "framer-motion";

const CommentsData = [
  {
    id: 1,
    image:
      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg",
    studentName: "Nathaniel Owusu",
    departments: "Computer Science Dpt",
    comment:
      "Chale, this app dey make group work stress free. Normally we go dey argue over who do what. But now everything clear, No yawa.",
  },
  {
    id: 2,
    image:
      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg",
    studentName: "Nathaniel Owusu",
    departments: "IT Dpt",
    comment:
      "Chale, this app dey make group work stress free. Normally we go dey argue over who do what. But now everything clear, No yawa.",
  },
  {
    id: 3,
    image:
      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg",
    studentName: "Nathaniel Owusu",
    departments: "Business Dpt",
    comment:
      "Chale, this app dey make group work stress free. Normally we go dey argue over who do what. But now everything clear, No yawa.",
  },
  {
    id: 4,
    image:
      "https://res.cloudinary.com/dmdnq9vh8/image/upload/v1727979151/PORTFOLIO/original_picture_rq8bmg.jpg",
    studentName: "Nathaniel Owusu",
    departments: "Electrical Engineering Dpt",
    comment:
      "Chale, this app dey make group work stress free. Normally we go dey argue over who do what. But now everything clear, No yawa.",
  },
];

const StudentsComments = ({ onSwiperInit }) => {
  return (
    <motion.div
      variants={{
        visible: { transition: { staggerChildren: 0.2 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Swiper
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        onSwiper={onSwiperInit}
      >
        {CommentsData.map((data) => (
          <SwiperSlide key={data.id}>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className="grid gap-2 border-[0.1rem] border-gray-200 p-4 rounded-xl"
            >
              <div className="flex justify-between">
                <img
                  className="w-[4rem] h-[4rem]"
                  src={data.image}
                  alt="student"
                />
                <div className="text-yellow-300 flex gap-2">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaRegStarHalfStroke />
                </div>
              </div>
              <div className="grid gap-2">
                <h1 className="font-Montserrat-Bold text-xs">
                  {data.studentName}
                </h1>
                <p className="text-[#2394db] font-Montserrat-Bold text-xl">
                  {data.departments}
                </p>
                <p className="text-sm">{data.comment}</p>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </motion.div>
  );
};

export default StudentsComments;
