import * as axiosService from "./axiosService";

export const RegisterAdmin = async (adminData) => {
  const response = await axiosService.Post("/Auth/api/admin/register", adminData);
  return response;
};
