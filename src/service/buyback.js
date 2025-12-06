import * as axiosService from "./axiosService";

// GET /api/buyback/admin/get?orderId=&productId=&buybackId=&page=&size=
export const getAdminBuybacks = async (params = {}) => {
  // params: { orderId, productId, buybackId, page, size }
  const response = await axiosService.Get("/buyback/admin/get", params);
  return response.data;
};

export const buybackStatus = async (params = {}) => {
  // params: { orderId, productId, buybackId, page, size }
  const response = await axiosService.Put("/buyback/admin/update", params);
  return response.data;
};



