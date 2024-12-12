import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductUpload from "./pages/ProductUpload";
import AuthProvider from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductUpdate from "./pages/EditProduct";

const App = () => {


  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="/upload" element={
              <ProtectedRoute>
                <ProductUpload />
              </ProtectedRoute>} />
            <Route path="/edit/:id" element={
              <ProtectedRoute>
                <ProductUpdate />
              </ProtectedRoute>} />
          </Routes>

        </div>
      </Router>
    </AuthProvider>

  );
};

export default App;
