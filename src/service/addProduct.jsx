import { PostMultipart } from "./axiosService";

export const AddProductCSV = async (file) => {
  const response = await PostMultipart("/Product/bulk-upload", file);
  return response.data;
};