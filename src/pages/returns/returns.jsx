import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Search, RotateCcw } from "lucide-react";
import {
  getAdminReturns,
  updateAdminReturn,
  getReturnsByOrderNumber,
  rejectAdminReturn,
  getReturnById,
  approveAdminReturn,
} from "../../service/returns";

const Returns = () => {
  const [status, setStatus] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [paginationTouched, setPaginationTouched] = useState(false);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [orderDetailsOrderNumber, setOrderDetailsOrderNumber] = useState("");
  const [orderDetailsItems, setOrderDetailsItems] = useState([]);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);
  const [orderDetailsError, setOrderDetailsError] = useState("");
  const [showCreateShipment, setShowCreateShipment] = useState(false);

  const [returnDetailsOpen, setReturnDetailsOpen] = useState(false);
  const [returnDetailsId, setReturnDetailsId] = useState("");
  const [returnDetailsData, setReturnDetailsData] = useState(null);
  const [returnDetailsLoading, setReturnDetailsLoading] = useState(false);
  const [returnDetailsError, setReturnDetailsError] = useState("");

  const [approveUseInstant, setApproveUseInstant] = useState(true);

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRemarks, setEditRemarks] = useState("");

  const totalPages = useMemo(() => {
    if (!total || !pageSize) return 0;
    return Math.ceil(total / pageSize);
  }, [total, pageSize]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const params = {
        status: status || undefined,
        orderNumber: orderNumber.trim() || undefined,
        page: paginationTouched ? page : undefined,
        pageSize: paginationTouched ? pageSize : undefined,
      };

      const data = await getAdminReturns(params);

      const list = Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];

      const totalItems =
        typeof data?.total === "number"
          ? data.total
          : typeof data?.count === "number"
            ? data.count
            : typeof data?.totalItems === "number"
              ? data.totalItems
              : Array.isArray(list)
                ? list.length
                : 0;

      setItems(list);
      setTotal(totalItems);
    } catch (err) {
      setItems([]);
      setTotal(0);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to fetch return orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize]);

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setPage(1);
    setPaginationTouched(true);
    fetchReturns();
  };

  const handleResetFilters = () => {
    setStatus("");
    setOrderNumber("");
    setPage(1);
    setPageSize(50);
    setPaginationTouched(false);
    fetchReturns();
  };

  const statusOptions = ["", "Pending", "Processing", "Approved", "Rejected", "Refunded"];

  const handleOpenOrderDetails = async (ordNumber) => {
    if (!ordNumber) return;
    setOrderDetailsOpen(true);
    setOrderDetailsOrderNumber(ordNumber);
    setOrderDetailsItems([]);
    setOrderDetailsError("");
    try {
      setOrderDetailsLoading(true);
      const data = await getReturnsByOrderNumber(ordNumber);
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setOrderDetailsItems(list);
      if (!list.length) {
        setOrderDetailsError("No returns found for this order number.");
      }
    } catch (err) {
      setOrderDetailsError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to load returns for this order"
      );
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleCloseOrderDetails = () => {
    setOrderDetailsOpen(false);
    setOrderDetailsOrderNumber("");
    setOrderDetailsItems([]);
    setOrderDetailsError("");
  };

  const handleOpenReturnDetails = async (id) => {
    if (!id) return;
    setReturnDetailsOpen(true);
    setReturnDetailsId(id);
    setReturnDetailsData(null);
    setReturnDetailsError("");
    try {
      setReturnDetailsLoading(true);
      const data = await getReturnById(id);
      setReturnDetailsData(data || null);
    } catch (err) {
      setReturnDetailsError(
        err?.response?.status === 404
          ? "Return not found."
          : err?.response?.status === 403
            ? "You are not allowed to view this return."
            : err?.response?.data?.message ||
            err?.response?.data?.error ||
            err.message ||
            "Failed to load return details"
      );
    } finally {
      setReturnDetailsLoading(false);
    }
  };

  const handleCloseReturnDetails = () => {
    setReturnDetailsOpen(false);
    setReturnDetailsId("");
    setReturnDetailsData(null);
    setReturnDetailsError("");
  };

  const handleOpenEdit = (item) => {
    const dbId = item.id || item._id || item.returnId || null;
    if (!dbId) return;
    setEditingId(dbId);
    setEditStatus(item.status || "Pending");
    setEditRemarks(item.adminRemarks || "");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStatus("");
    setEditRemarks("");
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const payload = {
        adminRemarks: editRemarks || undefined,
        status: editStatus || undefined,
      };
      const data = await updateAdminReturn(editingId, payload);
      setSuccess(data?.message || "Return updated.");
      handleCancelEdit();
      await fetchReturns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to update return"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRejectReturn = async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const payload = {
        adminRemarks: editRemarks || undefined,
      };
      const data = await rejectAdminReturn(editingId, payload);
      setSuccess(data?.message || "Return request rejected.");
      handleCancelEdit();
      await fetchReturns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to reject return"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReturn = async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const payload = {
        adminRemarks: editRemarks || undefined,
        useInstantRefund: approveUseInstant,
      };
      const data = await approveAdminReturn(editingId, payload);

      if (data?.success === false) {
        setError(data?.message || "Return approved but refund could not be initiated.");
      } else {
        setSuccess(data?.message || "Return approved and refund initiated.");
      }

      handleCancelEdit();
      await fetchReturns();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Failed to approve return"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#58471c]">
            <RotateCcw size={14} /> Returns
          </div>
          <h1 className="text-3xl font-light text-black">Return Orders</h1>
          <p className="text-sm text-gray-500">
            Search and review customer return requests.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={fetchReturns}
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 space-y-4">
        <form
          onSubmit={handleApplyFilters}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Order Number</label>
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="ORD-2025-0001"
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:border-black"
            >
              {statusOptions.map((opt) => (
                <option key={opt || "all"} value={opt}>
                  {opt === "" ? "All" : opt}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 w-full md:w-auto"
            >
              <Search size={16} /> Apply Filters
            </button>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full md:w-auto"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </form>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per Page</label>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
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
            Showing page <strong>{totalPages > 0 ? page : 0}</strong> of{" "}
            <strong>{totalPages}</strong>, total <strong>{total}</strong>{" "}
            record{total === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {success && (
        <div className="rounded-3xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-b-2 border-black"></div>
            <p className="mt-4 text-sm text-gray-500">
              Loading return orders…
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">
            No return orders found.
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#fdf8ea]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Return Order No.
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Order Number
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Refund Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Refund Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Actions
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[#8a7643]">
                      Reverse Pickup
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {items.map((it, idx) => {
                    const dbId = it.id || it._id || it.returnId || null;
                    const id =
                      it.returnOrderNumber ||
                      it.returnNumber ||
                      dbId ||
                      "—";
                    const ordNumber = it.orderNumber || it.orderNo || "—";
                    const st = it.status || "—";
                    const refundAmount =
                      typeof it.refundAmount === "number"
                        ? it.refundAmount
                        : it.refund?.amount ?? null;
                    const refundStatus =
                      it.refundStatus || it.refund?.status || "—";
                    const created =
                      it.createdAt || it.requestedAt || it.date || null;
                    const createdAt = created
                      ? new Date(created).toLocaleString()
                      : "—";

                    return (
                      <tr
                        key={`${id}-${idx}`}
                        className="hover:bg-[#fbf6e6]"
                      >
                        <td className="px-6 py-5 text-sm text-black">
                          {dbId ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReturnDetails(dbId)}
                              className="underline underline-offset-2 decoration-gray-400 hover:text-black"
                            >
                              {id}
                            </button>
                          ) : (
                            id
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          <button
                            type="button"
                            onClick={() => handleOpenOrderDetails(ordNumber)}
                            className="underline underline-offset-2 decoration-gray-400 hover:text-black"
                          >
                            {ordNumber}
                          </button>
                        </td>
                        <td className="px-6 py-5 text-sm">
                          <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                            {st}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          {refundAmount != null ? `₹${refundAmount}` : "—"}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          {refundStatus}
                        </td>
                        <td className="px-6 py-5 text-sm text-[#473d21]">
                          {createdAt}
                        </td>
                        <td className="px-6 py-5 text-sm text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(it)}
                            className="inline-flex items-center rounded-full border border-gray-300 px-4 py-1.5 text-xs text-black hover:bg-gray-50"
                          >
                            Update
                          </button>
                        </td>
                        <td className="px-6 py-5 text-sm text-right">

                          <button
                            onClick={() => setShowCreateShipment(true)}
                            className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition"
                          >
                            Create Shipment
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-gray-200">
              {items.map((it, idx) => {
                const dbId = it.id || it._id || it.returnId || null;
                const id =
                  it.returnOrderNumber ||
                  it.returnNumber ||
                  dbId ||
                  "—";
                const ordNumber = it.orderNumber || it.orderNo || "—";
                const st = it.status || "—";
                const refundAmount =
                  typeof it.refundAmount === "number"
                    ? it.refundAmount
                    : it.refund?.amount ?? null;
                const refundStatus =
                  it.refundStatus || it.refund?.status || "—";
                const created =
                  it.createdAt || it.requestedAt || it.date || null;
                const createdAt = created
                  ? new Date(created).toLocaleString()
                  : "—";

                return (
                  <div key={`${id}-${idx}`} className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-medium text-black flex items-center gap-2">
                          {dbId ? (
                            <button
                              type="button"
                              onClick={() => handleOpenReturnDetails(dbId)}
                              className="flex items-center gap-2 underline underline-offset-2 decoration-gray-400"
                            >
                              <RotateCcw size={16} /> {id}
                            </button>
                          ) : (
                            <>
                              <RotateCcw size={16} /> {id}
                            </>
                          )}
                        </h3>
                        <p className="text-xs text-gray-500">{st}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {createdAt}
                      </span>
                    </div>
                    <div className="text-sm text-[#473d21] space-y-1">
                      <p>
                        <span className="text-gray-500">Order:</span>{" "}
                        <button
                          type="button"
                          onClick={() => handleOpenOrderDetails(ordNumber)}
                          className="underline underline-offset-2 decoration-gray-400"
                        >
                          {ordNumber}
                        </button>
                      </p>
                      <p>
                        <span className="text-gray-500">Refund:</span>{" "}
                        {refundAmount != null ? `₹${refundAmount}` : "—"}
                      </p>
                      <p>
                        <span className="text-gray-500">Refund Status:</span>{" "}
                        {refundStatus}
                      </p>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(it)}
                          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-1.5 text-xs text-black hover:bg-gray-50"
                        >
                          Update
                        </button>
                      </div>
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
            Page <strong>{totalPages > 0 ? page : 0}</strong> of{" "}
            <strong>{totalPages}</strong>
          </div>
          <button
            type="button"
            onClick={() => {
              setPaginationTouched(true);
              setPage((p) =>
                totalPages === 0 || p >= totalPages ? p : p + 1
              );
            }}
            disabled={totalPages === 0 || page >= totalPages}
            className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-black hover:bg-gray-50 disabled:opacity-50 inline-flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-medium text-black">Update / Approve / Reject Return</h2>
            <form onSubmit={handleSubmitEdit} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black"
                >
                  {statusOptions
                    .filter((s) => s !== "")
                    .map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-600">Admin Remarks</label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  rows={3}
                  placeholder="Add remarks for this return…"
                  className="rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none"
                />
              </div>
              <div className="flex items-center gap-2 pt-1 text-xs text-gray-600">
                <input
                  id="approve-instant-refund"
                  type="checkbox"
                  checked={approveUseInstant}
                  onChange={(e) => setApproveUseInstant(e.target.checked)}
                  className="h-3 w-3 rounded border-gray-300 text-black focus:ring-black"
                />
                <label htmlFor="approve-instant-refund">
                  Use instant refund (if payment supports it)
                </label>
              </div>
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleApproveReturn}
                    className="rounded-full border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Approving..." : "Approve & Refund"}
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectReturn}
                    className="rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700 hover:bg-red-100 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Rejecting..." : "Reject Return"}
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-gray-900 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {returnDetailsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-black">
                  Return Details
                </h2>
                <p className="text-xs text-gray-500">
                  Owner/Admin can view this return by ID.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseReturnDetails}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {returnDetailsLoading ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading return…
              </div>
            ) : returnDetailsError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {returnDetailsError}
              </div>
            ) : !returnDetailsData ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No data available.
              </div>
            ) : (
              <div className="space-y-4 text-sm text-[#473d21]">
                {(() => {
                  const rt = returnDetailsData;
                  const id =
                    rt.returnOrderNumber ||
                    rt.returnNumber ||
                    rt.id ||
                    rt._id ||
                    returnDetailsId;
                  const ordNumber = rt.orderNumber || rt.orderNo || "—";
                  const st = rt.status || "—";
                  const refundAmount =
                    typeof rt.refundAmount === "number"
                      ? rt.refundAmount
                      : rt.refund?.amount ?? null;
                  const refundStatus =
                    rt.refundStatus || rt.refund?.status || "—";
                  const created =
                    rt.createdAt || rt.requestedAt || rt.date || null;
                  const createdAt = created
                    ? new Date(created).toLocaleString()
                    : "—";
                  const items = Array.isArray(rt.items) ? rt.items : [];

                  return (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase text-gray-500">
                            Return ID
                          </div>
                          <div className="text-base font-medium text-black">
                            {id}
                          </div>
                        </div>
                        <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                          {st}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-gray-500">Order Number</div>
                          <div className="font-medium">{ordNumber}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Created At</div>
                          <div className="font-medium">{createdAt}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Refund Amount</div>
                          <div className="font-medium">
                            {refundAmount != null ? `₹${refundAmount}` : "—"}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Refund Status</div>
                          <div className="font-medium">{refundStatus}</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500">
                          Items ({items.length})
                        </div>
                        {items.length === 0 ? (
                          <div className="text-xs text-gray-500">
                            No item snapshot available.
                          </div>
                        ) : (
                          <div className="max-h-52 overflow-y-auto rounded-2xl border border-gray-100">
                            <table className="min-w-full text-xs">
                              <thead className="bg-[#fdf8ea] text-[#8a7643]">
                                <tr>
                                  <th className="px-3 py-2 text-left font-medium">
                                    Item
                                  </th>
                                  <th className="px-3 py-2 text-left font-medium">
                                    Qty
                                  </th>
                                  <th className="px-3 py-2 text-left font-medium">
                                    Price
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-100">
                                {items.map((it, idx) => {
                                  const name =
                                    it.name ||
                                    it.title ||
                                    it.productName ||
                                    it.sku ||
                                    it.id ||
                                    `Item ${idx + 1}`;
                                  const qty =
                                    it.quantity ||
                                    it.qty ||
                                    it.count ||
                                    1;
                                  const price =
                                    it.price ||
                                    it.unitPrice ||
                                    it.amount ||
                                    null;
                                  return (
                                    <tr key={idx}>
                                      <td className="px-3 py-2">
                                        {name}
                                      </td>
                                      <td className="px-3 py-2">
                                        {qty}
                                      </td>
                                      <td className="px-3 py-2">
                                        {price != null ? `₹${price}` : "—"}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      )}

      {orderDetailsOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-black">
                  Returns for Order {orderDetailsOrderNumber}
                </h2>
                <p className="text-xs text-gray-500">
                  Owner/Admin can see returns for this specific order.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseOrderDetails}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {orderDetailsLoading ? (
              <div className="py-8 text-center text-sm text-gray-500">
                Loading returns…
              </div>
            ) : orderDetailsError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
                {orderDetailsError}
              </div>
            ) : orderDetailsItems.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-500">
                No returns found for this order.
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                {orderDetailsItems.map((rt) => {
                  const id =
                    rt.returnOrderNumber ||
                    rt.returnNumber ||
                    rt.id ||
                    rt._id ||
                    "—";
                  const st = rt.status || "—";
                  const refundAmount =
                    typeof rt.refundAmount === "number"
                      ? rt.refundAmount
                      : rt.refund?.amount ?? null;
                  const refundStatus =
                    rt.refundStatus || rt.refund?.status || "—";
                  const created =
                    rt.createdAt || rt.requestedAt || rt.date || null;
                  const createdAt = created
                    ? new Date(created).toLocaleString()
                    : "—";

                  return (
                    <div key={id} className="py-3 text-sm text-[#473d21] space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-black">
                          {id}
                        </div>
                        <span className="inline-flex rounded-full bg-[#f7f1de] px-3 py-1 text-xs font-medium text-[#58471c]">
                          {st}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">{createdAt}</div>
                      <div className="flex flex-wrap gap-4 text-xs">
                        <span>
                          <span className="text-gray-500">Refund:</span>{" "}
                          {refundAmount != null ? `₹${refundAmount}` : "—"}
                        </span>
                        <span>
                          <span className="text-gray-500">Refund Status:</span>{" "}
                          {refundStatus}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;


