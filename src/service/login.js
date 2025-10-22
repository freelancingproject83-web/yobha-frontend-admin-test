import * as axiosService from "./axiosService"; 

export const RegisterUser = async (payload) => {
    try {

        const response = await axiosService.Post("/Auth/api/admin/register", payload);
        return response.data;
    } catch (error) {

        throw error;
    }
};

export const LoginUser = async (payload) => {
    try {
        const response = await axiosService.Post("/Auth/login", payload);
        return response.data;
    } catch (error) {

        throw error;
    }
};




