import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({
  isOpen,
  title = "Tasdiqlaysizmi?",
  message = "Ushbu amalni bajarishni istaysizmi?",
  confirmText = "Ha",
  cancelText = "Yo‘q",
  onConfirm,
  onCancel,
  type = "danger",
}) => {
  const getConfirmColor = () => {
    switch (type) {
      case "warning":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-red-600 hover:bg-red-700"; // danger
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        onClick={(e) => e.stopPropagation()}
          key="confirmModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[2000]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6 w-80 text-center"
          >
            <h3 className="text-lg font-semibold dark:text-zinc-100 text-zinc-800 mb-2">
              {title}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-6">
              {message}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-1 rounded-md bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-400 dark:hover:bg-zinc-500 transition"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-1 rounded-md text-white transition ${getConfirmColor()}`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
