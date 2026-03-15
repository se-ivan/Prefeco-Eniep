"use client";

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoginModal } from './LoginModal';
import { ThemeToggle } from './ThemeToggle';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'INICIO', href: '/#inicio' },
    { label: 'GALERÍA', href: '/#galeria' },
    { label: 'PLANTELES', href: '/#planteles' },
    { label: 'CONTACTO', href: '/#contacto' },
    { label: 'HOTELES', href: '/hoteles' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    // If it's a hash link and we are on home page, scroll to it
    if (href.startsWith('/#')) {
      const targetId = href.replace('/', '');
      if (window.location.pathname === '/') {
        e.preventDefault();
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setIsMobileMenuOpen(false);
        }
      } else {
        // Just let it navigate to /#hash
        setIsMobileMenuOpen(false);
      }
    } else {
      // It's a regular route like /hoteles
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-sm shadow-lg border-b border-border' : 'bg-background/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <motion.a
            href="/#inicio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer"
            onClick={(e) => handleNavClick(e, '/#inicio')}
          >
            <img src="/logo.png" alt="PREFECO Logo" className="h-10 w-10 sm:h-12 sm:w-12 object-contain" />
            <div className="flex flex-col">
              <span className="font-bold text-[#0b697d] dark:text-[#2eb4cc] text-sm sm:text-base">PREFECO</span>
              <span className="text-xs text-muted-foreground hidden sm:block">Melchor Ocampo</span>
            </div>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm font-medium text-foreground/80 hover:text-[#0b697d] transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
            <div className="h-6 w-[1px] bg-border mx-2" />
            <ThemeToggle />
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setIsLoginModalOpen(true)}
              className="px-6 py-2 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
            >
              INICIAR SESIÓN
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-[#0b697d]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground/80 hover:bg-[#0b697d]/10 hover:text-[#0b697d] rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
              >
                INICIAR SESIÓN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </motion.nav>
  );
}