import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Search, Package, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminBuybacks } from "../../service/buyback";

const Buyback = () => {
  const [orderId, setOrderId] = useState("");
  const [productId, setProductId] = useState("");
  const [buybackId, setBuybackId] = useState("");
  const [page, setPage] = useState(1); // UI default
  const [size, setSize] = useState(20); // UI default
  const [paginationTouched, setPaginationTouched] = useState(false);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const totalPages = useMemo(() => {
    if (!total || !size) return 0;
    return Math.ceil(total / size);
  }, [total, size]);

  const fetchBuybacks = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {
        orderId: orderId.trim() ? orderId.trim() : undefined,
        productId: productId.trim() ? productId.trim() : undefined,
        buybackId: buybackId.trim() ? buybackId.trim() : undefined,
        page: paginationTouched ? page : undefined,
        size: paginationTouched ? size : undefined,
      };
      const data = await getAdminBuybacks(params);

      // Debug: Log the response structure
      console.log("Buyback API Response:", data);

      // Try multiple possible response structures
      let list = [];
      let totalItems = 0;

      // Check if data itself is an array
      if (Array.isArray(data)) {
        list = data;
        totalItems = data.length;
      }
      // Check for nested data structure (e.g., { data: { items: [...], total: ... } })
      else if (data?.data) {
        const nestedData = data.data;
        if (Array.isArray(nestedData)) {
          list = nestedData;
        } else if (Array.isArray(nestedData.items)) {
          list = nestedData.items;
        } else if (Array.isArray(nestedData.buybacks)) {
          list = nestedData.buybacks;
        } else if (Array.isArray(nestedData.results)) {
          list = nestedData.results;
        }
        totalItems =
          typeof nestedData.total === "number"
            ? nestedData.total
            : typeof nestedData.count === "number"
            ? nestedData.count
            : typeof nestedData.totalItems === "number"
            ? nestedData.totalItems
            : typeof nestedData.totalCount === "number"
            ? nestedData.totalCount
            : typeof data.total === "number"
            ? data.total
            : list.length;
      }
      // Check for direct properties
      else if (data) {
        if (Array.isArray(data.items)) {
          list = data.items;
        } else if (Array.isArray(data.buybacks)) {
          list = data.buybacks;
        } else if (Array.isArray(data.results)) {
          list = data.results;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        }

        totalItems =
          typeof data.total === "number"
            ? data.total
            : typeof data.count === "number"
            ? data.count
            : typeof data.totalItems === "number"
            ? data.totalItems
            : typeof data.totalCount === "number"
            ? data.totalCount
            : list.length;
      }

      console.log("Extracted list:", list);
      console.log("Extracted total:", totalItems);

      setItems(list);
      setTotal(totalItems);
    } catch (err) {
      console.error("Buyback fetch error:", err);
      setItems([]);
      setTotal(0);
      setError(err?.response?.data?.message || err.message || "Failed to fetch buyback records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuybacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    fetchBuybacks();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#58471c]">
            <CreditCard size={14} /> Buyback
          </div>
          <h1 className="text-3xl font-light text-black">Buyback Management</h1>
          <p className="text-sm text-gray-500">Search and review buyback requests.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={fetchBuybacks}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4">
        <form onSubmit={handleApplyFilters} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Order ID</label>
            <input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="ORD00099"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Product ID</label>
            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="PID123"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Buyback ID</label>
            <input
              value={buybackId}
              onChange={(e) => setBuybackId(e.target.value)}
              placeholder="6550a1b2c3d4e5f678901234"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 w-full md:w-auto"
            >
              <Search size={16} /> Apply Filters
            </button>
          </div>
        </form>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per Page</label>
          <select
            value={size}
            onChange={(e) => {
              setSize(Number(e.target.value));
              setPage(1);
              setPaginationTouched(true);
            }}
            className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
          >
            {[10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <div className="text-sm text-gray-600">
            Showing page <strong>{totalPages > 0 ? page : 0}</strong> of <strong>{totalPages}</strong>, total{" "}
            <strong>{total}</strong> record{total === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-black"></div>
            <p className="mt-4 text-sm text-gray-500">Loading buyback records…</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">No records found.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#fdf8ea]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Product ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Buyback ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">Requested At</th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#8a7643]">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((it, idx) => {
                    const _orderId = it.orderId || it.order?.id || it.orderReference || "—";
                    const _productId = it.productId || it.product?.id || "—";
                    const _buybackId = it.id || it._id?.$oid || it._id || it.buybackId || "—";
                    const customer =
                      it.customerName ||
                      (it.customer ? `${it.customer.firstName || ""} ${it.customer.lastName || ""}`.trim() : "") ||
                      it.userName ||
                      "—";
                    const status = it.status || it.state || "—";
                    const created = it.createdAt || it.requestedAt || it.date || null;
                    const createdAt = created ? new Date(created).toLocaleString() : "—";
                    const amount = it.amount || it.refundAmount || 0;
                    return (
                      <tr key={`${_buybackId}-${idx}`} className="hover:bg-[#fbf6e6]">
                        <td className="px-6 py-5 text-sm text-black">{_orderId}</td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">{_productId}</td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">{_buybackId}</td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">{customer}</td>
                        <td className="px-6 py-5 text-sm">
                          <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">{createdAt}</td>
                        <td className="px-6 py-5 text-right text-sm text-[#473d21]">₹{amount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200">
              {items.map((it, idx) => {
                const _orderId = it.orderId || it.order?.id || it.orderReference || "—";
                const _productId = it.productId || it.product?.id || "—";
                const _buybackId = it.id || it._id?.$oid || it._id || it.buybackId || "—";
                const customer =
                  it.customerName ||
                  (it.customer ? `${it.customer.firstName || ""} ${it.customer.lastName || ""}`.trim() : "") ||
                  it.userName ||
                  "—";
                const status = it.status || it.state || "—";
                const created = it.createdAt || it.requestedAt || it.date || null;
                const createdAt = created ? new Date(created).toLocaleString() : "—";
                const amount = it.amount || it.refundAmount || 0;
                return (
                  <div key={`${_buybackId}-${idx}`} className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-medium text-black flex items-center gap-2">
                          <Package size={16} /> {_buybackId}
                        </h3>
                        <p className="text-xs text-gray-500">{status}</p>
                      </div>
                      <span className="text-xs text-gray-500">{createdAt}</span>
                    </div>
                    <div className="text-sm text-[#473d21] space-y-1">
                      <p>
                        <span className="text-gray-500">Order:</span> {_orderId}
                      </p>
                      <p>
                        <span className="text-gray-500">Product:</span> {_productId}
                      </p>
                      <p>
                        <span className="text-gray-500">Customer:</span> {customer}
                      </p>
                      <p>
                        <span className="text-gray-500">Amount:</span> ₹{amount}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={() => {
              setPaginationTouched(true);
              setPage((p) => Math.max(1, p - 1));
            }}
            disabled={page === 1}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <div className="text-sm text-gray-600">
            Page <strong>{totalPages > 0 ? page : 0}</strong> of <strong>{totalPages}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setPaginationTouched(true);
              setPage((p) => (totalPages === 0 || p >= totalPages ? p : p + 1));
            }}
            disabled={totalPages === 0 || page >= totalPages}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Buyback;
