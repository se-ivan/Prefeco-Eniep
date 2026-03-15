"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Shield, TrendingUp, Zap, Github, Loader2, Eye, EyeOff } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const registrosNoDisponiblesMessage = 'Todavia no es el momento de los registros para instituciones';

  const isAnyLoading = isLoading || socialLoading !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showCountdown) return;

    // 16 de marzo del 2026 a las 18:00 (Hora México/Centro aproximada)
    const targetDate = new Date('2026-03-16T18:00:00-06:00').getTime();

    const interval = setInterval(() => {
      const distance = targetDate - new Date().getTime();

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showCountdown]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.username({
        username: username.trim().toLowerCase(),
            password,
        });

        if (error) {
            setError(error.message || 'Error al iniciar sesión');
            toast.error(error.message || 'Error al iniciar sesión');
        } else {
            const meResponse = await fetch('/api/me', {
              credentials: 'include',
            });

            let isAdmin = false;

            if (meResponse.ok) {
              const me = await meResponse.json();
              if (me?.role === 'ADMIN') {
                isAdmin = true;
              }
            }
            
            // Calculamos si ya pasó la fecha
            const targetDate = new Date('2026-03-16T18:00:00-06:00').getTime();
            const now = new Date().getTime();
            
            if (now < targetDate && !isAdmin) {
              await authClient.signOut(); // Cerramos sesión para que no entren si recargan
              setShowCountdown(true);
            } else {
              toast.success('¡Inicio de sesión exitoso!');
              onClose();
              window.location.href = '/dashboard';
            }
        }
    } catch (err: any) {
        setError('Ocurrió un error inesperado');
        toast.error('Ocurrió un error inesperado');
    } finally {
        setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    setError('');
    setSocialLoading(provider);
    try {
        await authClient.signIn.social({
            provider,
        callbackURL: `${window.location.origin}/dashboard`,
        });
    } catch (err: any) {
        toast.error(`Error al iniciar sesión con ${provider}`);
      setSocialLoading(null);
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-101 flex items-center justify-center p-4 isolate">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative"
            >
              {/* Boton de cerrar */}
              <button
                onClick={onClose}
                disabled={isAnyLoading}
                className="absolute top-6 right-6 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Cerrar modal"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>

              <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                {/* Lado Informativo (Oculto en móviles) */}
                <div className="hidden lg:flex flex-col justify-center lg:w-1/2 p-8 lg:p-12 bg-linear-to-br from-gray-50 to-white dark:from-background dark:to-background overflow-y-auto border-r border-border">
                  <div className="max-w-md mx-auto w-full">
                    {/* Titulo y Logo */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 bg-[rgba(11,105,125,0.1)] dark:bg-[rgba(46,180,204,0.15)] rounded-2xl flex items-center justify-center p-4">
                          <img src="/logo-eniep.png" alt="ENIEP Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                        </div>
                        <h1 className="text-5xl font-bold mb-2">
                        <span className="text-foreground">ENIEP </span>
                        <span className="text-[#0b697d] dark:text-[#2eb4cc]">2026</span>
                      </h1>
                      </div>
                      
                      <p className="text-xl text-muted-foreground leading-relaxed">
                        Plataforma de Gestión de Eventos Deportivos y Culturales
                      </p>
                    </div>

                    <div className="space-y-4 mt-8">
                      {features.map((feature, index) => (
                        <motion.div
                          key={feature.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center shrink-0`}>
                            <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/*Formulario del login o Contador */}
                <div className="w-full lg:w-1/2 p-6 lg:p-12 flex items-center bg-card text-card-foreground overflow-y-auto relative">
                  <div className="w-full max-w-md mx-auto mt-4 sm:mt-0">
                    {/* Logo solo en móviles */}
                    <div className="flex lg:hidden items-center justify-center mb-8">
                        <div className="w-20 h-20 bg-[rgba(11,105,125,0.1)] dark:bg-[rgba(46,180,204,0.15)] rounded-2xl flex items-center justify-center p-3">
                          <img src="/logo-eniep.png" alt="ENIEP Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                        </div>
                    </div>

                    {showCountdown ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center text-center space-y-6 md:space-y-8"
                      >
                        <div className="w-20 h-20 bg-[rgba(255,165,45,0.1)] rounded-full flex items-center justify-center mb-2">
                          <Lock className="w-10 h-10 text-[#ffa52d]" />
                        </div>
                        
                        <div>
                          <h2 className="text-3xl font-bold text-foreground mb-4">Registro en Pausa</h2>
                          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Favor de ingresar a partir del <br className="hidden md:block" />
                            <span className="font-bold text-foreground mx-1">lunes 16 de marzo</span> <br className="hidden md:block" />
                            para realizar sus registros
                          </p>
                        </div>
                        
                        <div className="mt-8 p-6 md:p-8 bg-card border border-border rounded-3xl shadow-lg shadow-[rgba(255,165,45,0.05)] w-full">
                          <h3 className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-6">Tiempo restante</h3>
                          <div className="flex justify-center gap-3 md:gap-5 text-[#ffa52d] font-mono">
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.days.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Días</span>
                            </div>
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 -mt-1 md:-mt-2 text-foreground">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Hrs</span>
                            </div>
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 -mt-1 md:-mt-2 text-foreground">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Min</span>
                            </div>
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 -mt-1 md:-mt-2 text-foreground">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Seg</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setShowCountdown(false);
                            onClose();
                          }}
                          className="w-full mt-4 py-4 bg-linear-to-r from-[#0b697d] to-[#ffa52d] hover:from-[#0a5a6b] hover:to-[#e69427] dark:from-[#2eb4cc] dark:to-[#ffb54d] text-white dark:text-[#020f12] rounded-xl font-bold hover:shadow-xl transition-all"
                        >
                          Entendido
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <div className="mb-8 text-center lg:text-left">
                          <h2 className="text-3xl font-bold text-foreground mb-2">Bienvenido</h2>
                          <p className="text-muted-foreground">Inicia sesión para acceder a la plataforma</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
                      {/* Username Input */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Usuario
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="usuario_prefeco"
                            disabled={isAnyLoading}
                            className="w-full pl-12 pr-4 py-3.5 bg-input-background dark:bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
                            required
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Contraseña
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isAnyLoading}
                            className="w-full pl-12 pr-12 py-3.5 bg-input-background dark:bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-foreground"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isAnyLoading}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      {/* Restablecer Contra */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            disabled={isAnyLoading}
                            className="w-4 h-4 rounded border-border text-primary focus:ring-ring dark:bg-input"
                          />
                          <span className="text-sm text-muted-foreground">Mantener sesión iniciada</span>
                        </label>
                        <button type="button" className="text-sm text-[#0b697d] dark:text-[#2eb4cc] hover:underline font-medium">
                          Restablecer Contraseña
                        </button>
                      </div>

                      {/* Mensaje de error */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
                        >
                          <p className="text-sm text-destructive">{error}</p>
                        </motion.div>
                      )}

                      {/* Iniciar Sesion */}
                      <button
                        type="submit"
                        disabled={isAnyLoading}
                        className="w-full py-4 bg-linear-to-r from-[#0b697d] to-[#ffa52d] hover:from-[#0a5a6b] hover:to-[#e69427] dark:from-[#2eb4cc] dark:to-[#ffb54d] text-white dark:text-[#020f12] rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Iniciando sesión...
                          </>
                        ) : socialLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Redirigiendo...
                          </>
                        ) : (
                          'Iniciar Sesión'
                        )}
                      </button>


                      {/* Ayuda */}
                      <p className="text-center text-sm text-muted-foreground">
                        ¿Necesitas ayuda?{' '}
                        <button type="button" className="text-[#0b697d] dark:text-[#2eb4cc] hover:underline">
                          Contactanos
                        </button>
                      </p>
                    </form>
                    </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
