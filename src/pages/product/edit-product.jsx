import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { GetProductById, UpdateProduct } from "../../service/productAPI";

export default function EditProductPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    fetchProductData();
  }, [productId]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("=== FETCHING PRODUCT DATA ===");
      console.log("Product ID:", productId);
      
      const response = await GetProductById(productId);
      console.log("=== PRODUCT API RESPONSE ===");
      console.log("Raw response:", response);
      console.log("Response type:", typeof response);
      console.log("Response keys:", response ? Object.keys(response) : "No response");
      
      // Log the full response structure
      if (response) {
        console.log("Full response structure:", JSON.stringify(response, null, 2));
      }
      console.log("============================");
      
      // Handle different possible response formats
      let product = null;
      if (response && response.data) {
        product = response.data;
        console.log("✅ Using response.data as product");
      } else if (response && !response.data) {
        product = response;
        console.log("✅ Using response directly as product");
      } else {
        console.log("❌ No valid product data found");
      }
      
      if (product) {
        console.log("Setting product data:", product);
        setProductData(product);
      } else {
        console.log("❌ Product not found");
        setError("Product not found");
      }
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      setError("Failed to fetch product details. Please try again.");
    } finally {
      setLoading(false);
      console.log("=== PRODUCT FETCH COMPLETED ===");
    }
  };

  const handleSubmit = async (updatedProductData) => {
    try {
      console.log("Updating product:", productId, updatedProductData);
      
      const response = await UpdateProduct(productId, updatedProductData);
      console.log("Product updated successfully:", response);
      
      alert("Product updated successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Error updating product. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm font-light">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-gray-50 border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-light text-black mb-2">Error</h3>
            <div className="text-sm text-gray-600 font-light mb-6">
              <p>{error}</p>
            </div>
            <div className="space-x-3">
              <button
                onClick={fetchProductData}
                className="bg-black text-white px-6 py-2 text-sm font-light hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/products")}
                className="bg-white border border-gray-300 text-black px-6 py-2 text-sm font-light hover:bg-gray-50 transition-colors"
              >
                Back to Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center py-12">
          <h3 className="text-lg font-light text-black mb-2">Product not found</h3>
          <p className="text-gray-500 text-sm font-light mb-6">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-black text-white px-6 py-2 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black mb-2">Edit Product</h1>
            <p className="text-gray-500 text-sm font-light">
              Update product information
            </p>
          </div>
          <button
            onClick={() => navigate("/products")}
            className="bg-white border border-gray-300 text-black px-6 py-2 text-sm font-light hover:bg-gray-50 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>

      {/* Product Form */}
      <ProductForm
        initialData={productData}
        onSubmit={handleSubmit}
        isEditMode={true}
        submitButtonText="Update Product"
      />
    </div>
  );
}