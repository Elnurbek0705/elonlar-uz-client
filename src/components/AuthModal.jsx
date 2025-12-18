import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginSuccess } from "../redux/userSlice";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const AuthModal = ({ isOpen, onClose, redirectTo = "/" }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", lastName: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        console.log(res.data.token);
        
        localStorage.setItem("token", res.data.token);
        dispatch(loginSuccess(res.data));

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
        }, 1000);
      } else {
        // REGISTER
        await axios.post("http://localhost:5000/api/auth/register", {
          name: formData.name,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        });

        toast.success("Ro‘yxatdan o‘tish muvaffaqiyatli! Endi tizimga kiring ✅", {
          duration: 3000,
          style: {
            background: "#2563eb",
            color: "#fff",
            fontWeight: 500,
          },
        });

        setIsLogin(true);
      }
    } catch (err) {
      toast.error("Xatolik yuz berdi. Ma'lumotlarni tekshirib qayta urinib ko‘ring ❌", {
        duration: 3000,
        style: {
          background: "#dc2626",
          color: "#fff",
          fontWeight: 500,
        },
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Toaster position="top-center" reverseOrder={false} />

          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-96 rounded-2xl shadow-lg
                       bg-white dark:bg-zinc-800 p-6"
            initial={{ opacity: 0, scale: 0.8, y: "-50%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-bold text-center mb-4 dark:text-white">
              {isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}
            </h2>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Ism"
                  value={formData.name}
                  onChange={handleChange}
                  className="border w-full mb-3 p-2 rounded focus:outline-blue-500 dark:bg-zinc-700 dark:text-white"
                />
              )}

              {!isLogin && (
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border w-full mb-3 p-2 rounded focus:outline-blue-500 dark:bg-zinc-700 dark:text-white"
                />
              )}

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border w-full mb-3 p-2 rounded focus:outline-blue-500 dark:bg-zinc-700 dark:text-white"
              />

              <input
                type="password"
                name="password"
                placeholder="Parol"
                value={formData.password}
                onChange={handleChange}
                className="border w-full mb-4 p-2 rounded focus:outline-blue-500 dark:bg-zinc-700 dark:text-white"
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
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    Ro‘yxatdan o‘tish
                  </span>
                </>
              ) : (
                <>
                  Akkountingiz bormi?{" "}
                  <span
                    onClick={() => setIsLogin(true)}
                    className="text-blue-600 hover:underline cursor-pointer"
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
