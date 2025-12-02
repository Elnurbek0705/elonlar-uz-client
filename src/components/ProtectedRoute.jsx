import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import AuthModal from "./AuthModal";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.user);
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ⚡ Foydalanuvchi kirishga uringan manzil
  const fromPath = location.pathname;

  if (!userInfo) {
    if (!authOpen) setAuthOpen(true);

    // X tugmasi bosilganda => Bosh sahifaga qaytish
    const handleClose = () => {
      setAuthOpen(false);
      navigate("/");
    };

    return (
      <AuthModal
        isOpen={authOpen}
        onClose={handleClose}
        redirectTo={fromPath} // ⚡ Shu pathni modalga yuboramiz
      />
    );
  }

  return children;
};

export default ProtectedRoute;
