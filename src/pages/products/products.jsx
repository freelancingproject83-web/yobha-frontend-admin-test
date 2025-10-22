import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { GetAllProducts, DeleteProduct } from "../../service/productAPI";

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Starting to fetch products...");
      
      const productsData = await GetAllProducts();
      
      console.log("=== PRODUCTS API DEBUG ===");
      console.log("Raw API Response:", productsData);
      console.log("Response Type:", typeof productsData);
      console.log("Is Array:", Array.isArray(productsData));
      console.log("Response Keys:", productsData ? Object.keys(productsData) : "No keys");
      console.log("===========================");
      
      // Handle different possible response formats
      let productsArray = [];
      if (Array.isArray(productsData)) {
        productsArray = productsData;
        console.log("✅ Using productsData as array:", productsArray.length);
      } else if (productsData && productsData.data && Array.isArray(productsData.data.items)) {
        // Handle the actual API response format: { data: { items: [...] } }
        productsArray = productsData.data.items;
        console.log("✅ Using productsData.data.items:", productsArray.length);
        console.log("📊 Pagination info:", {
          page: productsData.data.page,
          pageSize: productsData.data.pageSize,
          totalCount: productsData.data.totalCount,
          totalPages: productsData.data.totalPages
        });
      } else if (productsData && Array.isArray(productsData.data)) {
        productsArray = productsData.data;
        console.log("✅ Using productsData.data:", productsArray.length);
      } else if (productsData && productsData.products && Array.isArray(productsData.products)) {
        productsArray = productsData.products;
        console.log("✅ Using productsData.products:", productsArray.length);
      } else {
        console.log("❌ No valid products array found in response");
        console.log("Available keys:", productsData ? Object.keys(productsData) : "No data");
        if (productsData && productsData.data) {
          console.log("Data keys:", Object.keys(productsData.data));
        }
      }
      
      console.log("Final products array:", productsArray);
      setProducts(productsArray);
    } catch (err) {
      console.error("Error fetching products:", err);
      console.error("Error details:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(`Failed to fetch products: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  const handleDelete = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      try {
        setDeleteLoading(productId);
        await DeleteProduct(productId);
        alert("Product deleted successfully!");
        // Refresh the products list
        await fetchProducts();
      } catch (err) {
        console.error("Error deleting product:", err);
        alert("Failed to delete product. Please try again.");
      } finally {
        setDeleteLoading(null);
      }
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-light">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-light text-gray-900 mb-2">Error</h3>
          <p className="text-gray-500 mb-6 text-sm">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-black text-white px-6 py-2 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Try Again
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
            <h1 className="text-3xl font-light text-black mb-2">Products</h1>
            <p className="text-gray-500 text-sm font-light">
              Manage your collection
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={fetchProducts}
              className="bg-white border border-gray-300 text-black px-6 py-2 text-sm font-light hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-black text-white px-6 py-2 text-sm font-light hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-6">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-3">No products found</h3>
            <p className="text-gray-500 mb-8 text-sm font-light">Start building your collection</p>
            <button
              onClick={() => navigate("/add-product")}
              className="bg-black text-white px-8 py-3 text-sm font-light hover:bg-gray-800 transition-colors"
            >
              Add Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-8 py-6 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-8 py-6 text-left text-xs font-light text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-6 text-right text-xs font-light text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          {product.images && product.images.length > 0 ? (
                            <img
                              className="h-16 w-16 object-cover"
                              src={product.images[0]}
                              alt={product.name || product.title}
                            />
                          ) : product.imageUrl || product.image ? (
                            <img
                              className="h-16 w-16 object-cover"
                              src={product.imageUrl || product.image}
                              alt={product.name || product.title}
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 flex items-center justify-center">
                              <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-6">
                          <div className="text-sm font-light text-gray-900">
                            {product.name || product.title || "Unnamed Product"}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            ID: {product.id || product._id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">
                        {product.category || product.productMainCategory || "N/A"}
                      </div>
                      {product.productMainCategory && product.category !== product.productMainCategory && (
                        <div className="text-xs text-gray-400 mt-1">
                          {product.productMainCategory}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">
                        ${product.price || product.costPrice || "0.00"}
                      </div>
                      {product.salePrice && product.salePrice !== product.price && (
                        <div className="text-xs text-gray-500 mt-1">
                          Sale: ${product.salePrice}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-light text-gray-900">
                        {product.stockQuantity || product.quantity || 0}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-light rounded-full ${
                        (product.available === true || product.status === 'active' || product.isActive) 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.available === true ? 'Available' : 
                         product.available === false ? 'Unavailable' :
                         product.status || (product.isActive ? 'Active' : 'Inactive')}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-light">
                      <div className="flex items-center justify-end space-x-4">
                        <button
                          onClick={() => handleEdit(product.id || product._id)}
                          className="text-gray-400 hover:text-black transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id || product._id, product.name || product.title)}
                          disabled={deleteLoading === (product.id || product._id)}
                          className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleteLoading === (product.id || product._id) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border border-gray-400 border-t-transparent"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {products.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-light text-gray-500">
              {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;