import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowUpDown, RefreshCw, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { GetAllOrdersAdmin } from "../../service/orders";
import CreateShipmentAction from "../deliveryModal/deliveryModal";
import { updateOrder } from "../../service/order";

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  console.log(orders , "orders")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchId, setSearchId] = useState("");
  const [debouncedSearchId, setDebouncedSearchId] = useState("");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paginationTouched, setPaginationTouched] = useState(false);
  console.log(selectedOrder)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCreateShipment, setShowCreateShipment] = useState(false);
  const [orderStatus, setOrderStatus] = useState(orders?.status || "");
  const [paymentStatus, setPaymentStatus] = useState(orders?.paymentStatus || "");
  const [statusLoading, setStatusLoading] = useState(false);
  const orderStatusOptions = ["Pending", "Shipped", "Delivered", "Returned", "Delivered"];
  const paymentStatusOptions = ["Pending", "Paid", "Refunded"];

  const sortOptions = [
    { value: "createdAt_desc", label: "Newest First" },
    { value: "createdAt_asc", label: "Oldest First" },
    // { value: "total_desc", label: "Highest Total" }
  ];

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching orders with params:", {
        page: paginationTouched ? currentPage : 1,
        pageSize: pageSize,
        id: debouncedSearchId,
        sort: sortBy
      });

      const response = await GetAllOrdersAdmin(
        paginationTouched ? currentPage : 1,
        pageSize,
        debouncedSearchId,
        sortBy
      );

      console.log("Orders response:", response);

      if (response && response.data) {
        setOrders(response.data);
        // Get pagination info from pagination object
        const totalCount = response.pagination?.totalRecords || response.totalCount || response.total || 0;
        const totalPagesValue = response.pagination?.totalPages || response.totalPages || Math.ceil(totalCount / pageSize) || 1;
        setTotalPages(totalPagesValue);
        setTotalOrders(totalCount);
      } else if (Array.isArray(response)) {
        setOrders(response);
        setTotalOrders(response.length);
        // Calculate totalPages based on pageSize
        setTotalPages(Math.ceil(response.length / pageSize) || 1);
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
  }, [currentPage, pageSize, debouncedSearchId, sortBy, navigate, paginationTouched]);

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
    setPaginationTouched(false);
    setCurrentPage(1);
    // Immediately trigger search without waiting for debounce
    setDebouncedSearchId(searchId);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPaginationTouched(false);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPaginationTouched(false);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchId("");
    setDebouncedSearchId("");
    setIsSearching(false);
    setPaginationTouched(false);
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
const updateOrderStatus = async (orderId, status) => {
  console.log(orderId ,status , "orderSt")
  const payload ={
    id:orders[0].id,
    paymentStatus: "",
    orderStatus:status,
    type:'Order'
  }
  try {
    setStatusLoading(true);
    await updateOrder( payload); // Call your axiosService function here
    alert("Order status updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update order status");
  } finally {
    setStatusLoading(false);
  }
};

const updatePaymentStatus = async (orderId, status) => {
  const payload ={
    id:orders[0].id,
    paymentStatus: status,
    orderStatus:"",
    type:'Order'
  }
  try {
    setStatusLoading(true);
    await updateOrder( payload); // Same function can handle both
    alert("Payment status updated successfully");
  } catch (err) {
    console.error(err);
    alert("Failed to update payment status");
  } finally {
    setStatusLoading(false);
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

          {/* Page Size */}
          <div className="space-y-2">
            <label className="block text-sm font-light text-gray-700">
              Page Size
            </label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="w-full border px-4 py-3 focus:outline-none transition-colors text-gray-900 bg-white text-sm font-light border-gray-300 focus:border-black"
            >
              <option value={1}>1 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>100 per page</option>
            </select>
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
                      Payment Method
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
                    <tr key={order.orderNumber || order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-light text-black">
                        {order.orderNumber || order.id || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-light">
                        {order.paymentMethod || "N/A"}
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
                            setSelectedOrder(order);
                            setIsModalOpen(true);
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
                <div key={order.orderNumber || order.id} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-light text-black text-sm">
                        Order #{order.orderNumber || order.id}
                      </h4>
                      <p className="text-gray-600 text-xs font-light">
                        {order.paymentMethod || "N/A"}
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
                        setSelectedOrder(order);
                        setIsModalOpen(true);
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
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              setPaginationTouched(true);
              setCurrentPage((p) => Math.max(1, p - 1));
            }}
            disabled={currentPage === 1 || loading}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="text-sm text-gray-600">
            Page <strong>{totalPages > 0 ? currentPage : 0}</strong> of <strong>{totalPages}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setPaginationTouched(true);
              setCurrentPage((p) =>
                totalPages === 0 || p >= totalPages ? p : p + 1
              );
            }}
            disabled={totalPages === 0 || currentPage >= totalPages || loading}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]">

            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-light text-black">
                Order Details — #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* Customer Section */}
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Customer Information</h3>
              <div className="border p-4 bg-gray-50">

                <p><strong>Name:</strong> {selectedOrder.shippingAddress?.fullName || "N/A"}</p>
                <p><strong>Phone:</strong> {selectedOrder.shippingAddress?.mobileNumner || "N/A"}</p>

                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.shippingAddress?.line1 || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.city || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.state || "N/A"},{" "}
                  {selectedOrder.shippingAddress?.zip || "N/A"}
                </p>

              </div>
            </div>

            {/* Items Section */}
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Items</h3>

              {selectedOrder.items?.map((item, index) => (
                <div key={index} className="border p-4 mb-4 bg-gray-50 flex gap-4">

                  <img
                    src={item.thumbnailUrl}
                    alt="product"
                    className="w-20 h-20 object-cover rounded border"
                  />

                  <div>
                    <p className="text-black font-light text-sm">{item.productName}</p>
                    <p className="text-gray-600 text-sm">Size: {item.size}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                    <p className="text-gray-600 text-sm">Color: {item.color?.join(", ")}</p>
                    <p className="text-gray-600 text-sm">Fabric: {item.fabric?.join(", ")}</p>

                    <p className="text-black font-light mt-1">
                      {formatCurrency(item.unitPrice, selectedOrder.currency)}
                    </p>
                  </div>

                </div>
              ))}
            </div>

            {/* Pricing Section */}
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Pricing Summary</h3>

              <div className="border p-4 bg-gray-50 text-sm space-y-1">

                <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.subTotal, selectedOrder.currency)}</p>
                <p><strong>Discount:</strong> {formatCurrency(selectedOrder.discount, selectedOrder.currency)}</p>
                <p><strong>Loyalty Discount:</strong> {formatCurrency(selectedOrder.loyaltyDiscountAmount, selectedOrder.currency)}</p>
                <p><strong>Shipping:</strong> {formatCurrency(selectedOrder.shipping, selectedOrder.currency)}</p>
                <p><strong>Tax:</strong> {formatCurrency(selectedOrder.tax, selectedOrder.currency)}</p>
                <p><strong>Gift Wrap:</strong> {formatCurrency(selectedOrder.total - ((selectedOrder.subTotal +selectedOrder.shipping +selectedOrder.tax) -selectedOrder.discount), selectedOrder.currency)}</p>

                <hr />

                <p className="text-lg">
                  <strong>Total:</strong> {formatCurrency(selectedOrder.total, selectedOrder.currency)}
                </p>

              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Payment Info</h3>

              <div className="border p-4 bg-gray-50 text-sm space-y-1">

                <p><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                <p><strong>Status:</strong> {selectedOrder.paymentStatus}</p>

                {/* Show only for Razorpay orders */}
                {selectedOrder.paymentMethod === "razorpay" && (
                  <>
                    <p><strong>Razorpay Order ID:</strong> {selectedOrder.razorpayOrderId || "N/A"}</p>
                    <p><strong>Razorpay Payment ID:</strong> {selectedOrder.razorpayPaymentId || "N/A"}</p>

                    <p>
                      <strong>Gateway Response:</strong>
                      <pre className="bg-white border p-2 text-xs mt-1 overflow-auto max-h-40">
                        {selectedOrder.paymentGatewayResponse || "N/A"}
                      </pre>
                    </p>
                  </>
                )}

              </div>
            </div>

            {/* Shipping Section */}
            <div className="mb-6">
              <h3 className="text-lg font-light mb-2">Shipping Info</h3>

              <div className="border p-4 bg-gray-50 text-sm space-y-1">

                <p><strong>Status:</strong> {selectedOrder.status}</p>
                <p><strong>Tracking ID:</strong> {selectedOrder.shippingTrackingId || "N/A"}</p>
                <p><strong>Partner:</strong> {selectedOrder.shippingPartner || "N/A"}</p>

                {selectedOrder.shippedAt && (
                  <p><strong>Shipped At:</strong> {new Date(selectedOrder.shippedAt).toLocaleString()}</p>
                )}

              </div>
              {/* Create Shipment Button */}
              <div className="mt-4">
                <label className="block text-sm font-light mb-1">Order Status</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full border px-3 py-2 text-sm focus:outline-none mb-2"
                >
                  <option value="">Select Order Status</option>
                  {orderStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <button
                  onClick={() => updateOrderStatus(orders.id,orderStatus )}
                  disabled={statusLoading || !orderStatus}
                  className="w-full bg-blue-600 text-white py-2 hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
                >
                  {statusLoading ? "Updating..." : "Update Order Status"}
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-light mb-1">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full border px-3 py-2 text-sm focus:outline-none mb-2"
                >
                  <option value="">Select Payment Status</option>
                  {paymentStatusOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <button
                  onClick={() => updatePaymentStatus(orders.id, paymentStatus )}
                  disabled={statusLoading || !paymentStatus}
                  className="w-full bg-green-600 text-white py-2 hover:bg-green-700 transition disabled:opacity-50 flex justify-center items-center"
                >
                  {statusLoading ? "Updating..." : "Update Payment Status"}
                </button>
              </div>

              <div className="mb-6 mt-6">
              {   <button
                  onClick={() => setShowCreateShipment(true)}
                  className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition"
                >
                  Create Shipment
                </button>}
                <div>awb:{orders[0]?.deliveryDetails?.awb}</div>
              </div>
              {/* Create Shipment */}
              {showCreateShipment && (
                <div className="mb-6 border-t pt-4">
                  <CreateShipmentAction
                    referenceType="Order"
                    shipmentType={
                      selectedOrder.shippingAddress?.country &&
                        selectedOrder.shippingAddress.country !== "India"
                        ? "International"
                        : "Domestic"
                    }
                    order={selectedOrder}
                    onSuccess={() => {
                      setShowCreateShipment(false);
                      setIsModalOpen(false);
                      fetchOrders();
                    }}
                  />
                </div>
              )}


            </div>

            {/* Footer */}
            <div className="text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}


    </div>
  );
}
