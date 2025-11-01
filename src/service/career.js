import * as axiosService from "./axiosService";

const BASE_PATH = "/careers/admin";

export const createCareerJob = async (payload) => {
  const response = await axiosService.Post(BASE_PATH, payload);
  return response.data;
};

export const getCareerJobs = async (params = {}) => {
  const response = await axiosService.Get(BASE_PATH, params);
  return response.data;
};

export const updateCareerJob = async (jobId, payload) => {
  const response = await axiosService.Put(`${BASE_PATH}/${jobId}`, payload);
  return response.data;
};

export const deleteCareerJob = async (jobId) => {
  const response = await axiosService.Delete(`${BASE_PATH}/${jobId}`);
  return response.data;
};



