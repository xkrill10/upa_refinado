import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const location = useLocation();
  const isSchedulePage = location.pathname === "/escala";

  return (
    <div className="h-full rounded-xl overflow-hidden bg-background flex shadow-sm border">
      <motion.main
        initial={false}
        className="flex-1 h-full overflow-hidden relative"
      >
        {isSchedulePage ? (
          <div className="h-full p-4 flex flex-col">
            <Outlet />
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            <div className="p-6 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </div>
        )}
      </motion.main>
    </div>
  );
}
