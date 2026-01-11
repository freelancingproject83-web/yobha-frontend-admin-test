import React, { useState } from "react";
import { CreateShipment } from "../../service/delivery";


const PICKUP_DETAILS = {
    pickupName: "Warehouse",
    pickupPhone: "9504051829",
    pickupAddress:
        "B 1503, Tower B, JLPL Galaxy Heights, Sector 66 A, Mohali, SAS Nagar",
    pickupPincode: "140308",
};

export default function CreateShipmentAction({
    shipmentType, // "Domestic" | "International"
    order,
    onSuccess,
    referenceType
}) {
    const [weight, setWeight] = useState("");
    const [loading, setLoading] = useState(false);

    const [isInternational, setIsInternational] = useState(shipmentType === "International" ? true : false);

    console.log(order, "order")
    const handleCreateShipment = async () => {
        if (!weight || Number(weight) <= 0) {
            alert("Please enter valid weight");
            return;
        }

        // 🔹 Base payload
        const payload = {
            orderId: order.id,
            referenceType: referenceType,
            isInternational: shipmentType === "International" ? true : false,
            weight: Number(weight),
            isCod: shipmentType === "International" ? true : order.paymentMethod === "COD" ? true : false,
            commodity: "Apparel",
            currency: order.currency,
            CountryCode: "IN",
        };

        // 🟢 Domestic payload
        if (!isInternational) {
            Object.assign(payload, {
                ...PICKUP_DETAILS,
                dropName: order.shippingAddress?.fullName,
                dropPhone: order.shippingAddress?.mobileNumner,
                dropAddress: `${order.shippingAddress?.line1}, ${order.shippingAddress?.city}`,
                dropPincode: order.shippingAddress?.zip,
                ...(order.paymentMethod === "COD" && {
                    codAmount: order.total,

                }),
            });
        }

        // 🔵 International payload
        if (isInternational) {
            Object.assign(payload, {
                dropName: order.shippingAddress?.fullName,
                dropAddress: `${order.shippingAddress?.line1}, ${order.shippingAddress?.city}`,
                countryCode: order.shippingAddress?.countryCode,

                declaredValue: order.total,

            });
        }

        try {
            setLoading(true);
            await CreateShipment(payload);
            alert("Shipment created successfully");
            onSuccess?.();
        } catch (error) {
            console.error(error);
            alert("Failed to create shipment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border p-4 bg-gray-50 space-y-4">
            <div>
                <label className="block text-sm font-light mb-1">
                    Shipment Weight (KG)
                </label>
                <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="w-full border px-3 py-2 text-sm focus:outline-none"
                />
            </div>

            <button
                onClick={handleCreateShipment}
                disabled={loading}
                className="w-full bg-black text-white py-2 hover:bg-gray-800 transition disabled:opacity-50"
            >
                {loading ? "Creating Shipment..." : "Create Shipment"}
            </button>
        </div>
    );
}
