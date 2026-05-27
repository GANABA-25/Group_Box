import { FaFileWord, FaRegFileAlt, FaRegImage } from "react-icons/fa";
import { ImVideoCamera } from "react-icons/im";
import { BsFilePdfFill } from "react-icons/bs";
import { AiFillFilePpt } from "react-icons/ai";

export const getFileTypeIcon = (mimeType) => {
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return <FaFileWord className="text-[#2394db]" />;
  }
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  ) {
    return <AiFillFilePpt className="text-[#9333ea]" />;
  }
  if (mimeType === "application/pdf") {
    return <BsFilePdfFill className="text-[#22a753]" />;
  }
  if (mimeType.startsWith("image/")) {
    return <FaRegImage className="text-[#ea580c]" />;
  }
  if (mimeType.startsWith("video/")) {
    return <ImVideoCamera className="text-[#ed8c8c]" />;
  }
  return <FaRegFileAlt className="text-gray-500" />;
};
