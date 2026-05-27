import { useState, useEffect } from "react";

export const useFetch = (fetchFn) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async (uri, config = {}) => {
    setIsLoading(true);
    try {
      const response = await fetchFn(uri, config);
      const { data } = response;
      setFetchedData(data);
    } catch (error) {
      setErrorMsg({ message: error.message || "Failed to fetch data" });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchedData,
    fetchData,
    errorMsg,
  };
};
