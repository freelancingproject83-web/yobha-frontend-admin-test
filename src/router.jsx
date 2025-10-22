import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./comman/app-layout/app-layout";
import Signup from "./pages/signUp/sign-up";
import Login from "./pages/login/login";

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Lazy load pages
const AddProduct = lazy(() => import("./pages/product/add-product"));
const EditProduct = lazy(() => import("./pages/product/edit-product"));
const Products = lazy(() => import("./pages/products/products"));
const ImageUpload = lazy(() => import("./pages/image-upload/image-upload"));
const Orders = lazy(() => import("./pages/orders/orders"));
const TestLayout = lazy(() => import("./pages/test-layout"));

const Router = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Root redirect based on token */}
        <Route
          path="/"
          element={
            localStorage.getItem("auth_token") ? (
              <Navigate to="/products" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Private Routes */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AppLayout>
                <Products />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AppLayout>
                <AddProduct />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-product/:productId"
          element={
            <PrivateRoute>
              <AppLayout>
                <EditProduct />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/image-upload"
          element={
            <PrivateRoute>
              <AppLayout>
                <ImageUpload />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AppLayout>
                <Orders />
              </AppLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/test-layout"
          element={
            <PrivateRoute>
              <AppLayout>
                <TestLayout />
              </AppLayout>
            </PrivateRoute>
          }
        />

        {/* Catch-all unknown routes */}
        <Route
          path="*"
          element={
            localStorage.getItem("auth_token") ? (
              <Navigate to="/products" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
};

export default Router;
