import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import AuthForm from "./pages/AuthForm";
import Store from "./pages/Store";
import CartPage from "./pages/CartPage";
import Product from "./pages/Product";
import OrdersPage from "./pages/OrderPage";
import ProtectedLayout from "./pages/ProtectedLayout";
import LandingPage from "./pages/Landing";

export default function App() {
  return (
    <Routes>
      <Route path="/register" element={<AuthForm mode="register" />} />
      <Route path="/login" element={<AuthForm mode="login" />} />
      <Route path="/home" element={<LandingPage />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/store" element={<Store />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
