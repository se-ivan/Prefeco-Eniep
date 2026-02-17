"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, Shield, TrendingUp, Zap } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const { data, error } = await authClient.signIn.email({
            email,
            password,
            // better-auth handle rememberMe automatically with sessions or you can pass options if needed
        });

        if (error) {
            setError(error.message || 'Error al iniciar sesión');
            toast.error(error.message || 'Error al iniciar sesión');
        } else {
            toast.success('¡Inicio de sesión exitoso!');
            onClose();
            window.location.reload(); // Reload to update auth state
        }
    } catch (err: any) {
        setError('Ocurrió un error inesperado');
        toast.error('Ocurrió un error inesperado');
    } finally {
        setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Acceso Seguro',
      description: 'Plataforma protegida con encriptación de última generación',
      bgColor: 'bg-[rgba(11,105,125,0.1)]',
      iconColor: 'text-[#0b697d]',
    },
    {
      icon: TrendingUp,
      title: 'Gestión Centralizada',
      description: 'Administra participantes, equipos y encuentros en un solo lugar',
      bgColor: 'bg-[rgba(255,165,45,0.1)]',
      iconColor: 'text-[#ffa52d]',
    },
    {
      icon: Zap,
      title: 'Interfaz Intuitiva',
      description: 'Diseñada para usuarios sin experiencia técnica',
      bgColor: 'bg-[rgba(11,105,125,0.1)]',
      iconColor: 'text-[#0b697d]',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="flex flex-col lg:flex-row h-full overflow-y-auto lg:overflow-hidden">
                {/* Left Side - Info */}
                <div className="lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white">
                  <div className="max-w-md mx-auto">
                    {/* Logo and Title */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 bg-[rgba(11,105,125,0.1)] rounded-2xl flex items-center justify-center p-4">
                          <img src="/logo.png" alt="ENIEP Logo" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <h1 className="text-5xl font-bold mb-2">
                        <span className="text-[#0a0a0a]">ENIEP </span>
                        <span className="text-[#0b697d]">2026</span>
                      </h1>
                      <p className="text-xl text-[#717182] leading-relaxed">
                        Plataforma de Gestión de Eventos Deportivos y Culturales
                      </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 mt-8">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0a0a0a] mb-1">{feature.title}</h3>
                            <p className="text-sm text-[#717182] leading-relaxed">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="lg:w-1/2 p-8 lg:p-12 flex items-center bg-white">
                  <div className="w-full max-w-md mx-auto">
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-[#0a0a0a] mb-2">Bienvenido</h2>
                      <p className="text-[#717182]">Inicia sesión para acceder a la plataforma</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      {/* Email Input */}
                      <div>
                        <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                          Correo electrónico
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="w-full pl-12 pr-4 py-3.5 bg-[#f5f7fa] border border-[#e3e3e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b697d] focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Password Input */}
                      <div>
                        <label className="block text-sm font-semibold text-[#0a0a0a] mb-2">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-3.5 bg-[#f5f7fa] border border-[#e3e3e3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b697d] focus:border-transparent transition-all"
                            required
                          />
                        </div>
                      </div>

                      {/* Remember Me & Forgot Password */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-[#e3e3e3] text-[#0b697d] focus:ring-[#0b697d]"
                          />
                          <span className="text-sm text-[#717182]">Mantener sesión iniciada</span>
                        </label>
                        <button type="button" className="text-sm text-[#0b697d] hover:underline">
                          ¿Olvidaste tu contraseña?
                        </button>
                      </div>

                      {/* Error Message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-red-50 border border-red-200 rounded-xl"
                        >
                          <p className="text-sm text-red-600">{error}</p>
                        </motion.div>
                      )}

                      {/* Demo Credentials */}
                      <div className="p-4 bg-[rgba(11,105,125,0.05)] border border-[rgba(11,105,125,0.2)] rounded-xl">
                        <p className="text-xs font-semibold text-[#0b697d] mb-2">Credenciales Demo:</p>
                        <p className="text-xs text-[#717182]">Email: director@eniep.edu.mx</p>
                        <p className="text-xs text-[#717182]">Contraseña: demo2026</p>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                      </button>

                      {/* Support Link */}
                      <p className="text-center text-sm text-[#717182]">
                        ¿Necesitas ayuda?{' '}
                        <button type="button" className="text-[#0b697d] hover:underline">
                          Contacta soporte técnico
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
