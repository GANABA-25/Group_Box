import axios from "axios";

export const postUri = async (uri, data, config = {}) => {
  const response = await axios.post(uri, data, config);
  return response;
};

export const getUri = async (uri, config = {}) => {
  const response = await axios.get(uri, config);
  return response;
};

export const deleteUri = async (uri, config = {}) => {
  const response = await axios.delete(uri, config);
  return response;
};
