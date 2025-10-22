import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/ProductForm";
import { AddProduct } from "../../service/productAPI";

export default function AddProductPage() {
  const navigate = useNavigate();

  const handleSubmit = async (productData) => {
    try {
      console.log("Submitting product:", productData);
      const response = await AddProduct(productData);
      console.log("Product added successfully:", response);
      alert("Product added successfully!");
      navigate("/products");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product. Please try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black mb-2">Add Product</h1>
            <p className="text-gray-500 text-sm font-light">
              Create a new product for your collection
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
        onSubmit={handleSubmit}
        isEditMode={false}
        submitButtonText="Add Product"
      />
    </div>
  );
}