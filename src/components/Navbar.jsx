import { NavLink, useLocation } from "react-router-dom";
import { Sun, Moon, Menu, LogIn } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import AuthModal from "./AuthModal";
import ConfirmModal from "./ConfirmModal";
import ProfileModal from "./ProfileModal";
import logo from "../assets/logo.svg";

const Navbar = ({ collapsed, setCollapsed }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // 🔹 Sahifa nomi
  const getPageTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Bosh Sahifa";
      case "/elonlarim":
        return "E'lonlarim";
      case "/settings":
        return "Sozlamalar";
      default:
        return "Boshqaruv Paneli";
    }
  };

  // 🔹 Dark mode boshqaruvi
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") setDarkMode(true);
  }, []);

  // 🔹 Logout
  const handleLogoutConfirm = () => {
    dispatch(logout());
    setConfirmOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-2 right-2 transition-all duration-300 
        ${collapsed ? "left-20" : "left-68"} 
        rounded-lg z-10 h-16
        inset-shadow-sm inset-shadow-zinc-500 
        dark:bg-zinc-700/60 bg-zinc-300/60
        py-2 px-4 shadow-lg backdrop-blur-[20px] 
        flex justify-between items-center`}
      >
        {/* 🔹 Chap tomon */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-md hover:bg-zinc-400/40 dark:hover:bg-zinc-600/40 transition"
            onClick={() => setCollapsed((prev) => !prev)}
          >
            <Menu size={22} className="text-zinc-800 dark:text-zinc-200" />
          </button>

          <NavLink to="/" className="text-bold">
            <img className="w-18" src={logo} alt="logo" />
          </NavLink>

          <span className="hidden sm:block w-[1px] h-10 bg-zinc-400 dark:bg-zinc-600"></span>
          <h1 className="hidden sm:block text-lg font-semibold dark:text-zinc-100 text-zinc-800">
            {getPageTitle()}
          </h1>
        </div>

        {/* 🔹 O‘ng tomon */}
        <div className="flex items-center gap-4 relative">
          {/* Dark mode tugmasi */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md hover:bg-zinc-400/40 dark:hover:bg-zinc-600/70 transition dark:bg-zinc-700 bg-zinc-400"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-zinc-400 dark:text-zinc-200" />
            ) : (
              <Moon className="w-5 h-5 text-zinc-700 dark:text-zinc-200" />
            )}
          </button>

          {/* 🔹 Foydalanuvchi */}
          {userInfo ? (
            <button
              onClick={() => setProfileOpen(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img
                src={
                  userInfo.user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-zinc-400 object-cover"
              />
            </button>
          ) : (
            <button
              onClick={() => setAuthOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md transition"
            >
              Kirish
              <LogIn className="w-4 h-4 inline-block ml-2" />
            </button>
          )}
        </div>
      </header>

      {/* 🔹 Auth Modal */}
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />

      {/* 🔹 Confirm Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title="Chiqishni tasdiqlang"
        message="Rostdan ham tizimdan chiqmoqchimisiz?"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* 🔹 Profile Modal */}
      <ProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={userInfo?.user}
        onLogout={() => setConfirmOpen(true)}
      />
    </>
  );
};

export default Navbar;
