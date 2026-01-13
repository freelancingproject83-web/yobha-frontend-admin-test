import * as axiosService from "./axiosService";

export const getOrders = async () => {
  try {
    const response = await axiosService.Get("/Orders"); // GET request
    return response.data; // return API response data
  } catch (err) {
    console.error("Fetching orders failed:", err.response?.data || err.message);
    throw err;
  }
};
export const updateOrder = async (updateData) => {
  try {
    const response = await axiosService.Post(`/Admin/ChangeOrderStatus
`, updateData); 
    return response.data; // return API response data
  } catch (err) {
    console.error(

      err.response?.data || err.message
    );
    throw err;
  }
};