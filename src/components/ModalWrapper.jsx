import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ModalWrapper = ({ children }) => {
  const navigate = useNavigate();
  const close = () => navigate(-1);

  // Ekran o‘lchamiga qarab animatsiyani tanlaymiz
  const isMobile = window.innerWidth <= 768;

  const desktopMotion = {
    initial: { opacity: 0, scale: 0.85, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.9, y: 20 },
  };

  const mobileMotion = {
    initial: { opacity: 0, y: "100%" },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: "100%" },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
      >
        <motion.div
          {...(isMobile ? mobileMotion : desktopMotion)}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`relative bg-white dark:bg-zinc-800 shadow-xl rounded-t-2xl md:rounded-2xl w-full md:max-w-3xl md:w-auto ${
            isMobile ? "absolute bottom-0 p-5 pb-8" : "p-6"
          }`}
          onClick={(e) => e.stopPropagation()} // modal ichiga bosganda yopilmasin
        >
          {/* ✕ Yopish tugmasi */}
          <button
            onClick={close}
            className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
          >
            ✕
          </button>

          <div>{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalWrapper;
