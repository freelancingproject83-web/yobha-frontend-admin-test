import * as axiosService from "./axiosService";

export const GetAllOrdersAdmin = async (page = 1, pageSize = 10, id = "", sort = "createdAt_desc") => {
    try {
        console.log("GetAllOrdersAdmin: Making API call with params:", { page, pageSize, id, sort });
        
        // Check if token exists
        const token = localStorage.getItem("auth_token");
        console.log("GetAllOrdersAdmin: Auth token exists:", !!token);
        
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            Id: id,
            sort: sort
        });
        
        const fullUrl = `/Orders/GetAllOrdersAdmin?${params.toString()}`;
        console.log("GetAllOrdersAdmin: Full URL:", fullUrl);
        
        const response = await axiosService.Get(fullUrl);
        console.log("GetAllOrdersAdmin: Raw response:", response);
        console.log("GetAllOrdersAdmin: Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("GetAllOrdersAdmin error:", error);
        console.error("GetAllOrdersAdmin error response:", error.response);
        console.error("GetAllOrdersAdmin error status:", error.response?.status);
        console.error("GetAllOrdersAdmin error data:", error.response?.data);
        
        // Check if it's a 401 error
        if (error.response?.status === 401) {
            console.error("401 Unauthorized - Check if token is valid and not expired");
            console.error("Current token:", localStorage.getItem("auth_token"));
        }
        
        throw error;
    }
};
