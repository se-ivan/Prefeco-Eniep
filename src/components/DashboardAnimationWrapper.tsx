"use client";

import { motion } from "motion/react";
import { usePathname } from "next/navigation";

export default function DashboardAnimationWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 overflow-auto flex flex-col"
    >
      {children}
    </motion.div>
  );
}
