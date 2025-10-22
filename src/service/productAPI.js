import * as axiosService from "./axiosService";

// Get all products
export const GetAllProducts = async () => {
  try {
    console.log("GetAllProducts: Making API call to /Products");
    const response = await axiosService.Get("/Products");
    console.log("GetAllProducts: Raw response:", response);
    console.log("GetAllProducts: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("GetAllProducts error:", error);
    console.error("GetAllProducts error response:", error.response);
    console.error("GetAllProducts error status:", error.response?.status);
    console.error("GetAllProducts error data:", error.response?.data);
    throw error;
  }
};

// Get product by ID
export const GetProductById = async (productId) => {
  try {
    console.log("GetProductById: Making API call to /Products/" + productId);
    const response = await axiosService.Get(`/Products/${productId}`);
    console.log("GetProductById: Raw response:", response);
    console.log("GetProductById: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("GetProductById error:", error);
    console.error("GetProductById error response:", error.response);
    console.error("GetProductById error status:", error.response?.status);
    console.error("GetProductById error data:", error.response?.data);
    throw error;
  }
};

// Add new product
export const AddProduct = async (payload) => {
  try {
    console.log("AddProduct: Making API call to /Products");
    console.log("AddProduct: Payload:", payload);
    const response = await axiosService.Post("/Products", payload);
    console.log("AddProduct: Raw response:", response);
    console.log("AddProduct: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("AddProduct error:", error);
    console.error("AddProduct error response:", error.response);
    console.error("AddProduct error status:", error.response?.status);
    console.error("AddProduct error data:", error.response?.data);
    throw error;
  }
};

// Update product
export const UpdateProduct = async (productId, payload) => {
  try {
    console.log("UpdateProduct: Making API call to /Products/" + productId);
    console.log("UpdateProduct: Payload:", payload);
    const response = await axiosService.Put(`/Products/${productId}`, payload);
    console.log("UpdateProduct: Raw response:", response);
    console.log("UpdateProduct: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("UpdateProduct error:", error);
    console.error("UpdateProduct error response:", error.response);
    console.error("UpdateProduct error status:", error.response?.status);
    console.error("UpdateProduct error data:", error.response?.data);
    throw error;
  }
};

// Delete product
export const DeleteProduct = async (productId) => {
  try {
    console.log("DeleteProduct: Making API call to /Products/" + productId);
    const response = await axiosService.Delete(`/Products/${productId}`);
    console.log("DeleteProduct: Raw response:", response);
    console.log("DeleteProduct: Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("DeleteProduct error:", error);
    console.error("DeleteProduct error response:", error.response);
    console.error("DeleteProduct error status:", error.response?.status);
    console.error("DeleteProduct error data:", error.response?.data);
    throw error;
  }
};

// Get filtered products (existing function)
export const getFilteredProducts = async (payload) => {
  try {
    const response = await axiosService.Get("/Products", payload);
    return response.data;
  } catch (err) {
    console.error("getFilteredProducts error:", err.response?.data || err.message);
    throw err;
  }
};

// Get product description (existing function)
export const getProductDescription = async (id) => {
  try {
    const response = await axiosService.Get(`/Products/${id}`);
    return response.data;
  } catch (err) {
    console.error(
      "getProductDescription error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// Cart related functions (keeping existing)
export const getCartDetails = async () => {
  try {
    const response = await axiosService.Get(`/Cart`);
    return response.data;
  } catch (err) {
    console.error(
      "getCartDetails error:",
      err.response?.data || err.message
    );
    throw err;
  }
};

export const addToCart = async (payload) => {
  try {
    const response = await axiosService.Post(`/Cart`, payload);
    return response.data;
  } catch (err) {
    console.error("addToCart error:", err.response?.data || err.message);
    throw err;
  }
};

export const updateCartQuantity = async (payload) => {
  try {
    const response = await axiosService.Patch(`/Cart/quantity`, payload);
    return response.data;
  } catch (err) {
    console.error("updateCartQuantity error:", err.response?.data || err.message);
    throw err;
  }
};

export const deleteCartItem = async (id) => {
  try {
    const response = await axiosService.Delete(`/Cart/${id}`);
    return response.data;
  } catch (err) {
    console.error("deleteCartItem error:", err.response?.data || err.message);
    throw err;
  }
};