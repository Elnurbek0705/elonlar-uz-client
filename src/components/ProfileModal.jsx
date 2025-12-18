import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed top-20 right-2 z-50 w-70 bg-white dark:bg-zinc-700
                       rounded-xl shadow-lg p-5 flex flex-col gap-3"
            initial={{ opacity: 0, scale: 0.8, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  user?.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Avatar"
                className="w-12 h-12 rounded-full border-2 border-zinc-300 dark:border-zinc-600 object-cover"
              />
              <div>
                <h2 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {user?.name || "Foydalanuvchi"}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {user?.email || "email@namuna.uz"}
                </p>
              </div>
            </div>

            <hr className="border-zinc-300 dark:border-zinc-500" />

            <div className="flex flex-col gap-1">
              <button   
                onClick={() => {
                  onClose();
                  navigate("/settings");
                }}
                className="flex items-center gap-2 p-3 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-500 transition text-sm"
              >
                <Settings className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
                Sozlamalar
              </button>

              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="flex items-center gap-2 p-3 rounded-md hover:bg-red-100 dark:hover:bg-red-500/30 transition text-red-600 dark:text-red-400 text-sm"
              >
                <LogOut className="w-4 h-4" />
                Chiqish
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;
