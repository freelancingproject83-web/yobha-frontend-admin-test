import * as axiosService from "./axiosService";

// GET /api/returns/admin?status=&orderNumber=&page=&pageSize=
export const getAdminReturns = async (params = {}) => {
  // params: { status, orderNumber, page, pageSize }
  const response = await axiosService.Get("/returns/admin", params);
  return response.data;
};

// PUT /api/returns/admin/update/{id}
export const updateAdminReturn = async (id, payload) => {
  // payload: { adminRemarks, status }
  const response = await axiosService.Put(`/returns/admin/update/${id}`, payload);
  return response.data;
};

// GET /api/returns/order/{orderNumber}
export const getReturnsByOrderNumber = async (orderNumber) => {
  const response = await axiosService.Get(`/returns/order/${encodeURIComponent(orderNumber)}`);
  return response.data;
};

// POST /api/returns/admin/reject/{id}
export const rejectAdminReturn = async (id, payload) => {
  // payload: { adminRemarks }
  const response = await axiosService.Post(`/returns/admin/reject/${id}`, payload);
  return response.data;
};

// GET /api/returns/{id}
export const getReturnById = async (id) => {
  // Backend expects the database ID here (e.g. 6550a1b2c3d4e5f678901234), so encoding is safe.
  const response = await axiosService.Get(`/returns/${encodeURIComponent(id)}`);
  return response.data;
};

// POST /api/returns/admin/approve/{id}
export const approveAdminReturn = async (id, payload) => {
  // payload: { adminRemarks, useInstantRefund }
  const response = await axiosService.Post(`/returns/admin/approve/${id}`, payload);
  return response.data;
};

