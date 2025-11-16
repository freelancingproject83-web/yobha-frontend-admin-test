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

// Applicants
export const getCareerApplicants = async (params = {}) => {
  // Expected params: { jobTitle, page, limit }
  const response = await axiosService.Get("/careers/applicants", params);
  return response.data;
};

export const updateApplicantStatus = async (applicantId, statusOrPayload) => {
  // Accept either a string status or { status }
  const payload =
    typeof statusOrPayload === "string" ? { status: statusOrPayload } : statusOrPayload || {};
  const response = await axiosService.Patch(`/careers/applicants/${applicantId}/status`, payload);
  return response.data;
};


