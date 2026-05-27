import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../store/AuthContext";
import { usePost } from "../../hooks/usePost";
import { useFetch } from "../../hooks/useFetch";
import { deleteUri } from "../../../http";
import { postUri } from "../../../http";
import { getUri } from "../../../http";

import FeedbackMessage from "../../components/FeedbackMessage";
import { GrAttachment } from "react-icons/gr";
import { FaFileWord, FaRegFileAlt, FaRegImage } from "react-icons/fa";
import { ImVideoCamera, ImFileEmpty } from "react-icons/im";
import { BsFilePdfFill } from "react-icons/bs";
import { AiFillFilePpt } from "react-icons/ai";
import { RiDeleteBin5Line } from "react-icons/ri";

import { getFileTypeIcon } from "../../util/fileHelpers";

const AttachDocuments = ({ groupDocumentId }) => {
  const [groupFiles, setGroupFiles] = useState([]);
  const { token, isAuthenticated, userData } = useContext(AuthContext);
  const wordRef = useRef(null);
  const videoRef = useRef(null);
  const pdfRef = useRef(null);
  const pptRef = useRef(null);
  const imageRef = useRef(null);

  const { fetchedData, fetchData } = useFetch(getUri);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(
        `${
          import.meta.env.VITE_GET_GROUP_FILES_URI
        }?groupCode=${groupDocumentId}`
      );
    }
  }, [isAuthenticated, userData]);

  useEffect(() => {
    if (fetchedData) {
      setGroupFiles(fetchedData.documents || []);
    }
  }, [fetchedData]);

  const { isLoading, postResponse, errorMsg, postData } = usePost(postUri);

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const newFile = {
        file,
        name: file.name,
        type,
        time: "Just now",
        url: type === "Image" ? URL.createObjectURL(file) : null,
      };

      uploadFile(newFile);
    }
  };

  const uploadFile = (newFile) => {
    const formData = new FormData();
    formData.append("file", newFile.file);
    formData.append("schoolEmail", userData.schoolEmail);
    formData.append("groupDocumentId", groupDocumentId);

    postData(import.meta.env.VITE_UPLOAD_SELECTED_FILES_URI, formData);
  };

  useEffect(() => {
    if (postResponse && postResponse.data.document) {
      setGroupFiles(postResponse.data.document);
    }
  }, [postResponse]);

  const {
    isLoading: deleteFileLoading,
    postResponse: deleteFileResponse,
    setPostResponse: setDeletePostResponse,
    errorMsg: deleteFileErrorMsg,
    postData: deleteFilePostData,
  } = usePost(deleteUri);

  const deleteFileHandler = (fileId) => {
    deleteFilePostData(import.meta.env.VITE_REMOVE_FILE_URI, {
      data: { fileId, groupDocumentId, schoolEmail: userData.schoolEmail },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  useEffect(() => {
    if (deleteFileResponse && deleteFileResponse.data.document) {
      setGroupFiles(deleteFileResponse.data.document);

      const timeOutId = setTimeout(() => {
        setDeletePostResponse((prev) =>
          prev ? { ...prev, data: { ...prev.data, message: null } } : prev
        );
      }, 3000);

      return () => clearTimeout(timeOutId);
    }
  }, [deleteFileResponse]);
  return (
    <div className="grid gap-4 border border-gray-200 rounded-md shadow-sm mt-4">
      <div className="flex items-center gap-4 border-b border-gray-200 p-4">
        <div className="bg-blue-100 p-2 rounded-md">
          <GrAttachment className="text-sm text-[#2394db]" />
        </div>
        <div>
          <h1 className="font-Montserrat-Bold">Attach</h1>
          <p className="text-xs">
            Attach file, images, and resources to your workspace
          </p>
        </div>
      </div>

      <div className="max-[767px]:grid max-[767px]:grid-cols-3 md:flex justify-around p-4 border-b border-gray-200">
        <div
          className="grid gap-3 text-center border border-transparent hover:border-gray-300 hover:bg-gray-100 p-4 px-8 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => wordRef.current.click()}
        >
          <div className="bg-blue-100 p-4 rounded-full flex justify-center items-center">
            <FaFileWord className="text-lg text-[#2394db]" />
          </div>
          <p className="text-sm font-Montserrat-Bold text-gray-700">Doc</p>
          <input
            ref={wordRef}
            type="file"
            accept=".doc,.docx"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "Word")}
          />
        </div>

        <div
          className="grid gap-3 text-center border border-transparent hover:border-gray-300 hover:bg-gray-100 p-4 px-8 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => videoRef.current.click()}
        >
          <div className="bg-[#fef2f2] p-4 rounded-full flex justify-center items-center">
            <ImVideoCamera className="text-lg text-[#ed8c8c]" />
          </div>
          <p className="text-sm font-Montserrat-Bold text-gray-700">Video</p>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "Video")}
          />
        </div>

        <div
          className="grid gap-3 text-center border border-transparent hover:border-gray-300 hover:bg-gray-100 p-4 px-8 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => pdfRef.current.click()}
        >
          <div className="bg-[#f0fdf4] p-4 rounded-full flex justify-center items-center">
            <BsFilePdfFill className="text-lg text-[#22a753]" />
          </div>
          <p className="text-sm font-Montserrat-Bold text-gray-700">Pdf</p>
          <input
            ref={pdfRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "PDF")}
          />
        </div>

        <div
          className="grid gap-3 text-center border border-transparent hover:border-gray-300 hover:bg-gray-100 p-4 px-8 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => pptRef.current.click()}
        >
          <div className="bg-[#faf5ff] p-4 rounded-full flex justify-center items-center">
            <AiFillFilePpt className="text-lg text-[#9333ea]" />
          </div>
          <p className="text-sm font-Montserrat-Bold text-gray-700">Ppt</p>
          <input
            ref={pptRef}
            type="file"
            accept=".ppt,.pptx"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "PPT")}
          />
        </div>

        <div
          className="grid gap-3 text-center border border-transparent hover:border-gray-300 hover:bg-gray-100 p-4 px-8 rounded-xl transition-all duration-300 ease-in-out cursor-pointer"
          onClick={() => imageRef.current.click()}
        >
          <div className="bg-[#fff7ed] p-4 rounded-full flex justify-center items-center">
            <FaRegImage className="text-lg text-[#ea580c]" />
          </div>
          <p className="text-sm font-Montserrat-Bold text-gray-700">Image</p>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "Image")}
          />
        </div>
      </div>

      <div className="p-4 grid gap-4">
        <h1>Selected Files</h1>

        {errorMsg?.message && (
          <div className="w-110">
            <FeedbackMessage errorMessage={errorMsg.message} />
          </div>
        )}

        {deleteFileErrorMsg?.message && (
          <div className="w-110">
            <FeedbackMessage errorMessage={deleteFileErrorMsg.message} />
          </div>
        )}

        {deleteFileResponse?.data.message && (
          <div className="w-110">
            <FeedbackMessage successMsg={deleteFileResponse.data.message} />
          </div>
        )}

        {isLoading && (
          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            <span className="ml-2 text-sm text-blue-500">Uploading...</span>
          </div>
        )}

        {deleteFileLoading && (
          <div className="flex gap-1 items-center">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
            <span className="ml-2 text-sm text-red-600">Deleting file...</span>
          </div>
        )}

        {groupFiles.length === 0 && (
          <div className="flex items-center gap-3">
            <ImFileEmpty />
            <p className="text-xs text-gray-300 font-Montserrat-Bold">
              No files uploaded yet.
            </p>
          </div>
        )}

        {groupFiles.map((file, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {(() => {
                const icon = getFileTypeIcon(file.type);
                if (icon === "image") {
                  return (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  );
                }
                return icon;
              })()}

              <div>
                <h1 className="text-sm">{file.name}</h1>
                <p className="text-xs">{file.time}</p>
              </div>
            </div>

            <button
              onClick={() => deleteFileHandler(file._id)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-red-600 border border-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
            >
              <RiDeleteBin5Line className="text-xs" />
              <span className="text-xs font-medium">Remove</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachDocuments;
