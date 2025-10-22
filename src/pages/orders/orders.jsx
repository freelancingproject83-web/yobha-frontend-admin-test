import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, RefreshCw, Eye } from "lucide-react";
import { GetAllOrdersAdmin } from "../../service/orders";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [debouncedSearchId, setDebouncedSearchId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const sortOptions = [
    { value: "createdAt_desc", label: "Newest First" },
    { value: "createdAt_asc", label: "Oldest First" },
    { value: "total_desc", label: "Highest Total" }
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("Fetching orders with params:", {
        page: currentPage,
        pageSize,
        id: debouncedSearchId,
        sort: sortBy
      });

      const response = await GetAllOrdersAdmin(currentPage, pageSize, debouncedSearchId, sortBy);
      
      console.log("Orders response:", response);
      
      if (response && response.data) {
        setOrders(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalOrders(response.totalCount || 0);
      } else if (Array.isArray(response)) {
        setOrders(response);
        setTotalPages(1);
        setTotalOrders(response.length);
      } else {
        setOrders([]);
        setTotalPages(1);
        setTotalOrders(0);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      
      // Check for specific error types
      if (err.response?.status === 401) {
        setError("Authentication failed. Please login again.");
        // Optionally redirect to login
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to view orders.");
      } else if (err.response?.status === 404) {
        setError("Orders endpoint not found. Please check the API configuration.");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError(`Failed to fetch orders: ${err.response?.data?.message || err.message}`);
      }
      
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearchId, sortBy, navigate]);

  // Debounce search input
  useEffect(() => {
    if (searchId !== debouncedSearchId) {
      setIsSearching(true);
    }
    
    const timer = setTimeout(() => {
      setDebouncedSearchId(searchId);
      setIsSearching(false);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
      setIsSearching(false);
    };
  }, [searchId, debouncedSearchId]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setCurrentPage(1);
    // Immediately trigger search without waiting for debounce
    setDebouncedSearchId(searchId);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchId("");
    setDebouncedSearchId("");
    setIsSearching(false);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    if (amount === null || amount === undefined) return "N/A";
    
    // Handle different currency formats
    const currencyMap = {
      "USD": "en-US",
      "EUR": "de-DE", 
      "GBP": "en-GB",
      "INR": "en-IN",
      "AED": "ar-AE",
      "SAR": "ar-SA"
    };
    
    const locale = currencyMap[currency] || "en-US";
    
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency
      }).format(amount);
    } catch (error) {
      // Fallback to simple format if currency is not supported
      return `${currency} ${amount}`;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-black mb-2">Orders Management</h1>
            <p className="text-gray-500 text-sm font-light">
              View and manage all orders
            </p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="bg-white border border-gray-300 text-black px-6 py-2 text-sm font-light hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white border border-gray-200 p-8 mb-8">
        <div className="border-b border-gray-200 pb-6 mb-6">
          <h3 className="text-xl font-light text-black mb-2">Search & Filter</h3>
          <p className="text-gray-500 text-sm font-light">Find and sort orders</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search by ID */}
          <div className="space-y-2">
            <label className="block text-sm font-light text-gray-700">
              Search by Order ID
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 border px-4 py-3 focus:outline-none transition-colors text-gray-900 bg-white placeholder:text-gray-400 text-sm font-light border-gray-300 focus:border-black"
                placeholder="Enter Order ID..."
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center"
              >
                {isSearching ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Sort by */}
          <div className="space-y-2">
            <label className="block text-sm font-light text-gray-700">
              Sort By
            </label>
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full border px-4 py-3 pl-12 focus:outline-none transition-colors text-gray-900 bg-white text-sm font-light border-gray-300 focus:border-black"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Search */}
          <div className="flex items-end">
            <button
              onClick={handleClearSearch}
              className="w-full bg-white border border-gray-300 text-black px-4 py-3 hover:bg-gray-50 transition-colors text-sm font-light"
            >
              Clear Search
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-light text-black mb-1">
                Orders ({totalOrders})
              </h3>
              <p className="text-gray-500 text-sm font-light">Order management overview</p>
            </div>
            {loading && (
              <div className="flex items-center text-gray-600">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm font-light">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 m-6">
            <p className="text-red-700 text-sm font-light">{error}</p>
          </div>
        )}

        {/* Table Content */}
        {loading && orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-black mx-auto mb-4" />
              <p className="text-gray-600 text-sm font-light">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Eye className="h-8 w-8 text-gray-400 mx-auto mb-4" />
              <p className="text-black text-lg font-light mb-2">No orders found</p>
              <p className="text-gray-500 text-sm font-light">
                {searchId ? "Try adjusting your search criteria" : "Orders will appear here when available"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Order ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-light text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-light text-black">
                        {order._id || order.id || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">
                        {order.customerName || order.customer?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs font-light ${getOrderStatusColor(order.status)}`}>
                          {order.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-light text-black">
                        {formatCurrency(order.total, order.currency)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            // TODO: Implement order details view
                            console.log("View order:", order._id || order.id);
                          }}
                          className="text-black hover:text-gray-600 text-sm font-light transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              {orders.map((order) => (
                <div key={order._id || order.id} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-light text-black text-sm">
                        Order #{order._id || order.id}
                      </h4>
                      <p className="text-gray-600 text-xs font-light">
                        {order.customerName || order.customer?.name || "N/A"}
                      </p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-light ${getOrderStatusColor(order.status)}`}>
                      {order.status || "Unknown"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs font-light">Total</p>
                      <p className="font-light text-black">{formatCurrency(order.total, order.currency)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs font-light">Created</p>
                      <p className="text-gray-600 font-light">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // TODO: Implement order details view
                        console.log("View order:", order._id || order.id);
                      }}
                      className="text-black hover:text-gray-600 text-sm font-light transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-light">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1 border border-gray-300 text-sm text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-light"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1 border border-gray-300 text-sm text-black hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-light"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
