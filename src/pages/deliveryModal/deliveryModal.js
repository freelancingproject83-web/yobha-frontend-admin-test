import React, { useState } from "react";
import { CreateShipment } from "../../service/delivery";


const PICKUP_DETAILS = {
    pickupName: "JLPL Galaxy Heights",
    pickupPhone: "9504051829",
    pickupCity: "Mohali",
    pickupState: "Punjab",
    pickupAddress: "Building No./Flat No.: B 1503, Tower B\nName Of Premises/Building: JLPL Galaxy Heights\nRoad/Street: Sector 66 A\nLocality/Sub Locality: Sector 66A\n",
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

        const payload = {
            orderId: order.id,
            referenceType: referenceType,
            isInternational: shipmentType === "International" ? true : false,
            weight: Number(weight),
            isCod: shipmentType === "International" ? false : order.paymentMethod === "COD" ? true : false,
            amount: order.total,
        };

        if (!isInternational) {
            payload.pickupName = PICKUP_DETAILS.pickupName;
            payload.pickupPhone = PICKUP_DETAILS.pickupPhone;
            payload.pickupCity = PICKUP_DETAILS.pickupCity;
            payload.pickupState = PICKUP_DETAILS.pickupState;
            payload.pickupAddress = PICKUP_DETAILS.pickupAddress;
            payload.pickupPincode = PICKUP_DETAILS.pickupPincode;
            payload.dropName = order.shippingAddress?.fullName;
            payload.dropPhone = order.shippingAddress?.mobileNumner;
            payload.dropAddress = `${order.shippingAddress?.line1}, ${order.shippingAddress?.city}`;
            payload.dropCity = order.shippingAddress?.city;
            payload.dropState = order.shippingAddress?.state;
            payload.dropPincode = order.shippingAddress?.zip;
            payload.codAmount = order.paymentMethod === "COD" ? Number(order.total) : 0;
        }

        if (isInternational) {
            payload.currency = order.currency;
            payload.CountryCode = "IN";
            payload.dropName = order.shippingAddress?.fullName;
            payload.dropAddress = `${order.shippingAddress?.line1}, ${order.shippingAddress?.city}`;
            payload.countryCode = order.shippingAddress?.countryCode;
            payload.dropCity = order.shippingAddress?.city || "N/A";
            payload.dropState = order.shippingAddress?.state || "N/A";
            payload.declaredValue = order.total;
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
