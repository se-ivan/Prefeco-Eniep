"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"

export function ThemeToggle({ isTransparent = false }: { isTransparent?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Determine colors based on transparency mode and current theme
  const getIconColor = () => {
    if (isTransparent) {
      return "text-white";
    }
    return theme === "dark" ? "text-[#ffa52d]" : "text-[#0b697d]";
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-full overflow-hidden group transition-colors duration-500"
      aria-label="Toggle theme"
    >
      <div className={`absolute inset-0 transition-colors duration-500 rounded-full ${
        isTransparent 
          ? 'bg-white/10 group-hover:bg-white/20' 
          : 'bg-secondary/10 dark:bg-primary/20 group-hover:bg-secondary/20 dark:group-hover:bg-primary/30'
      }`} />
      <div className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          {theme === "dark" ? (
            <motion.div
              key="sun"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className={`w-5 h-5 transition-colors duration-500 ${getIconColor()}`} />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className={`w-5 h-5 transition-colors duration-500 ${getIconColor()}`} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}
