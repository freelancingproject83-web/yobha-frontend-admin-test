import * as axiosService from "./axiosService";

// GET /api/buyback/admin/get?orderId=&productId=&buybackId=&page=&size=
export const getAdminBuybacks = async (params = {}) => {
  // params: { orderId, productId, buybackId, page, size }
  const response = await axiosService.Get("/buyback/admin/get", params);
  return response.data;
};



