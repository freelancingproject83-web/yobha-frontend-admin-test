import * as axiosService from "./axiosService";

export const RegisterAdmin = async (adminData) => {
  const response = await axiosService.Post("/auth/register-admin", adminData);
  return response;
};
