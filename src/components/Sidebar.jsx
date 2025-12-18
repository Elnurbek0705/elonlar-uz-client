import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { HomeIcon, NotebookTabs, Menu, Settings, HeartIcon } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ collapsed, setCollapsed }) => {
  const pages = [
    { name: "Bosh Sahifa", path: "/", icon: HomeIcon },
    { name: "E'lonlarim", path: "/elonlarim", icon: NotebookTabs },
    { name: "Saqlanganlar", path: "/saved", icon: HeartIcon },
    { name: "Sozlamalar", path: "/settings", icon: Settings },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed left-2 top-2 h-[calc(100vh-1.2rem)] z-[10]
      dark:bg-zinc-700 bg-zinc-300 inset-shadow-sm inset-shadow-zinc-500 
      rounded-lg shadow-md p-2  flex flex-col"
    >
      {/* Toggle tugma */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 flex items-center justify-between p-2 rounded-md 
        hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors cursor-pointer"
      >
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="font-semibold text-zinc-800 dark:text-zinc-200 pl-2"
          >
            Sahifalar
          </motion.span>
        )}
        <Menu
          size={22}
          className={`text-zinc-700 dark:text-zinc-300 ${
            collapsed ? "mx-auto" : "mr-2"
          }`}
        />
      </button>

      <nav className="flex flex-col gap-1 relative">
        {pages.map(({ name, path, icon: Icon }) => (
          <div key={name} className="relative group">
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center rounded-md py-2 transition-colors group
                 ${
                   isActive
                     ? "bg-zinc-400 dark:bg-zinc-600"
                     : "hover:bg-zinc-400 dark:hover:bg-zinc-600"
                 }`
              }
            >
              <div
                className={`flex items-center justify-center min-w-[48px] ${
                  collapsed ? "mx-auto" : "ml-2"
                }`}
              >
                <Icon
                  size={22}
                  className="text-zinc-700 dark:text-zinc-300 flex-shrink-0"
                />
              </div>

              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25 }}
                  className="text-zinc-800 dark:text-zinc-200 ml-2 whitespace-nowrap"
                >
                  {name}
                </motion.span>
              )}
            </NavLink>

            {collapsed && (
              <span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3
                px-2 py-1 rounded-md text-sm dark:bg-zinc-600 bg-zinc-400 text-white
                opacity-0 group-hover:opacity-100 pointer-events-none
                transition-opacity duration-200 whitespace-nowrap shadow-lg z-50"
              >
                {name}
              </span>
            )}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
