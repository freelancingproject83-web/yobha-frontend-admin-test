import * as axiosService from "./axiosService";
export const CreateShipment = async (payload) => {
    try {

        const response = await axiosService.Post("/Delivery/create-shipment", payload);
        return response.data;
    } catch (error) {

        throw error;
    }
};