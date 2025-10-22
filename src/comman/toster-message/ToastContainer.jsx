import React, { useState, useEffect } from "react";

let toastHandler = null;

export const message = {
  success: (msg) => toastHandler && toastHandler("success", msg),
  error: (msg) => toastHandler && toastHandler("error", msg),
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // function to add a toast
  const addToast = (type, message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  // set the global handler
  useEffect(() => {
    toastHandler = addToast;
    return () => {
      toastHandler = null;
    };
  }, []);

  const getBgColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`${getBgColor(t.type)} text-white px-4 py-2 rounded shadow-lg`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
