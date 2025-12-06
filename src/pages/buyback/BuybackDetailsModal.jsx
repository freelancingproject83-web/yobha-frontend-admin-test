import React, { useState } from "react";
import { X } from "lucide-react";
import { buybackStatus } from "../../service/buyback";


const BuybackDetailsModal = ({ data, onClose }) => {
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState("");
  const [loading, setLoading] = useState(false);

  if (!data) return null;

  const isTradeInOrRecycle = data.requestType === "TradeIn" || data.requestType === "Recycle";
  const isRepairReuse = data.requestType === "RepairReuse";

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const payload = {
        buybackId: data.id,
        notes: notes || "",
        currency: data.currency || "INR",
        paymentMethod: data.paymentMethod,

        ...(isTradeInOrRecycle && { loyaltyPoints: Number(loyaltyPoints) }),
        ...(isRepairReuse && { amount: Number(amount) }),
      };

      console.log("FINAL PAYLOAD:", payload);

      await buybackStatus(payload);

      alert("Buyback status updated successfully!");
      onClose();

    } catch (error) {
      console.error(error);
      alert("Failed to update buyback status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden animate-fadeIn relative max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="p-6 border-b bg-gradient-to-r from-yellow-50 to-white flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Buyback Request Details</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <X size={22} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem label="Buyback ID" value={data.id} />
            <InfoItem label="Order ID" value={data.orderId} />
            <InfoItem label="Product ID" value={data.productId} />
            <InfoItem label="User ID" value={data.userId} />
            <InfoItem label="Country" value={data.country} />
            <InfoItem label="Request Type" value={data.requestType} />
            <InfoItem label="Status" value={data.buybackStatus} />
            <InfoItem label="Payment Method" value={data.paymentMethod} />
          </div>

          {/* PRODUCT IMAGES */}
          {data.productUrl?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Product Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {data.productUrl.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    className="rounded-xl border shadow-sm object-cover"
                    alt="Product"
                  />
                ))}
              </div>
            </div>
          )}

          {/* QUIZ TABLE */}
          {data.quiz?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Condition Quiz</h3>
              <div className="overflow-hidden border rounded-xl">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-3 text-left">Question</th>
                      <th className="p-3 text-left">Answer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {data.quiz.map((q, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="p-3 font-medium">{q.ques}</td>
                        <td className="p-3 text-gray-700">{q.ans}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NOTES */}
          <div className="space-y-1">
            <label className="text-sm font-semibold">Notes</label>
            <textarea
              className="w-full p-3 border rounded-xl bg-gray-50 focus:ring-yellow-400 focus:border-yellow-400"
              rows={3}
              placeholder="Add inspection notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* CONDITIONAL FIELDS */}
          {isTradeInOrRecycle && (
            <div>
              <label className="text-sm font-semibold">Loyalty Points *</label>
              <input
                type="number"
                value={loyaltyPoints}
                onChange={(e) => setLoyaltyPoints(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50"
                placeholder="Enter loyalty points"
              />
            </div>
          )}

          {isRepairReuse && (
            <div>
              <label className="text-sm font-semibold">Amount (INR) *</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border rounded-xl bg-gray-50"
                placeholder="Enter repair amount"
              />
            </div>
          )}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-md disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl border">
    <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
    <p className="text-sm font-semibold text-gray-800 mt-1 break-words">{value}</p>
  </div>
);

export default BuybackDetailsModal;
