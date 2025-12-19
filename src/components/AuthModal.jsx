import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginSuccess } from "../redux/userSlice";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const API = import.meta.env.VITE_API_URL;

const AuthModal = ({ isOpen, onClose, redirectTo = "/" }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      /* ================= LOGIN ================= */
      if (isLogin) {
        const res = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password,
        });

        const token = res.data.token;
        let user = res.data.user ?? null;

        // Agar backend user qaytarmagan bo‘lsa
        if (!user) {
          const meRes = await axios.get(`${API}/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          user = meRes.data.user ?? meRes.data;
        }

        localStorage.setItem("token", token);
        dispatch(loginSuccess({ token, user }));

        toast.success("Tizimga muvaffaqiyatli kirdingiz ✅", {
          duration: 2500,
          style: {
            background: "#16a34a",
            color: "#fff",
            fontWeight: 500,
          },
        });

        setTimeout(() => {
          onClose();
          navigate(redirectTo);
        }, 800);
      }

      /* ================= REGISTER ================= */
      else {
        await axios.post(`${API}/auth/register`, {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

        toast.success(
          "Ro‘yxatdan o‘tish muvaffaqiyatli! Endi tizimga kiring ✅",
          {
            duration: 3000,
            style: {
              background: "#2563eb",
              color: "#fff",
              fontWeight: 500,
            },
          }
        );

        setIsLogin(true);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Xatolik yuz berdi. Qayta urinib ko‘ring ❌",
        {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            fontWeight: 500,
          },
        }
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Toaster position="top-center" />

          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-96 p-6
                       bg-white dark:bg-zinc-800 rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.8, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
              {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
            </h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Ism"
                    value={formData.name}
                    onChange={handleChange}
                    className="border w-full mb-3 p-2 rounded dark:bg-zinc-700 dark:text-white"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Familiya"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="border w-full mb-3 p-2 rounded dark:bg-zinc-700 dark:text-white"
                  />
                </>
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border w-full mb-3 p-2 rounded dark:bg-zinc-700 dark:text-white"
              />

              <input
                type="password"
                name="password"
                placeholder="Parol"
                value={formData.password}
                onChange={handleChange}
                className="border w-full mb-4 p-2 rounded dark:bg-zinc-700 dark:text-white"
              />

              <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
                {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
              </button>
            </form>

            <p className="text-sm text-center mt-4 dark:text-zinc-300">
              {isLogin ? (
                <>
                  Akkount yo‘qmi?{" "}
                  <span
                    onClick={() => setIsLogin(false)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Ro‘yxatdan o‘tish
                  </span>
                </>
              ) : (
                <>
                  Akkountingiz bormi?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 cursor-pointer hover:underline"
                  >
                    Kirish
                  </span>
                </>
              )}
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
