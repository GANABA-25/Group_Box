import { useState } from "react";

export const usePost = (postFn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [postResponse, setPostResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState({});

  const postData = async (uri, postData, config = {}) => {
    try {
      setIsLoading(true);
      const response = await postFn(uri, postData, config);

      setPostResponse(response);
    } catch (error) {
      setErrorMsg({
        ...errorMsg,
        message: error.response.data.message || "Failed to post data",
      });

      setTimeout(() => {
        setErrorMsg({});
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    setIsLoading,
    postResponse,
    setPostResponse,
    errorMsg,
    setErrorMsg,
    postData,
  };
};
