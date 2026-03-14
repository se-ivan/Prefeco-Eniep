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

            if (meResponse.ok) {
              const me = await meResponse.json();

              // Si deseas volver a activar el bloqueo descomenta este bloque:
              // if (me?.role === 'RESPONSABLE_INSTITUCION') {
              //   await authClient.signOut();
              //   setError(registrosNoDisponiblesMessage);
              //   toast.error(registrosNoDisponiblesMessage);
              //   return;
              // }
            }

            // En lugar de redirigir al dashboard, mostramos el contador
            // toast.success('¡Inicio de sesión exitoso!');
            // onClose();
            // window.location.href = '/dashboard';
            
            // Calculamos si ya pasó la fecha
            const targetDate = new Date('2026-03-16T18:00:00-06:00').getTime();
            const now = new Date().getTime();
            
            if (now < targetDate) {
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 isolate">
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
                <div className="hidden lg:block lg:w-1/2 p-8 lg:p-12 bg-gradient-to-br from-gray-50 to-white dark:from-background dark:to-background overflow-y-auto border-r border-border">
                  <div className="max-w-md mx-auto">
                    {/* Titulo y Logo */}
                    <div className="mb-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-24 h-24 bg-[rgba(11,105,125,0.1)] dark:bg-[rgba(46,180,204,0.15)] rounded-2xl flex items-center justify-center p-4">
                          <img src="/logo-eniep.png" alt="ENIEP Logo" className="w-full h-full object-contain dark:brightness-0 dark:invert" onError={(e) => (e.currentTarget.src = '/logo.png')} />
                        </div>
                      </div>
                      <h1 className="text-5xl font-bold mb-2">
                        <span className="text-foreground">ENIEP </span>
                        <span className="text-[#0b697d] dark:text-[#2eb4cc]">2026</span>
                      </h1>
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
                          <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
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
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 mt-[-4px] md:mt-[-8px] text-foreground">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Hrs</span>
                            </div>
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 mt-[-4px] md:mt-[-8px] text-foreground">:</span>
                            <div className="flex flex-col items-center">
                              <span className="text-4xl md:text-5xl lg:text-6xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                              <span className="text-[10px] md:text-xs uppercase mt-2 text-muted-foreground font-sans font-bold">Min</span>
                            </div>
                            <span className="text-4xl md:text-5xl lg:text-6xl font-black opacity-30 mt-[-4px] md:mt-[-8px] text-foreground">:</span>
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
                          className="w-full mt-4 py-4 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] hover:from-[#0a5a6b] hover:to-[#e69427] dark:from-[#2eb4cc] dark:to-[#ffb54d] text-white dark:text-[#020f12] rounded-xl font-bold hover:shadow-xl transition-all"
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
                        className="w-full py-4 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] hover:from-[#0a5a6b] hover:to-[#e69427] dark:from-[#2eb4cc] dark:to-[#ffb54d] text-white dark:text-[#020f12] rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                      {/* Divisor */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-sm uppercase">
                          <span className="bg-card px-4 text-muted-foreground text-xs font-medium">O continúa con</span>
                        </div>
                      </div>

                      {/* OAuth */}
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => handleSocialLogin('google')}
                          disabled={isAnyLoading}
                          className="flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {socialLoading === 'google' ? (
                            <Loader2 className="w-5 h-5 animate-spin text-foreground" />
                          ) : (
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                              <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                              />
                              <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                              />
                              <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                              />
                              <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                              />
                            </svg>
                          )}
                          <span className="text-sm font-semibold text-foreground">Google</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSocialLogin('github')}
                          disabled={isAnyLoading}
                          className="flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-xl hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {socialLoading === 'github' ? (
                            <Loader2 className="w-5 h-5 animate-spin text-foreground" />
                          ) : (
                            <Github className="w-5 h-5 text-foreground" />
                          )}
                          <span className="text-sm font-semibold text-foreground">GitHub</span>
                        </button>
                      </div>

                      {/* Ayuda */}
                      <p className="text-center text-sm text-muted-foreground">
                        ¿Necesitas ayuda?{' '}
                        <button type="button" className="text-[#0b697d] dark:text-[#2eb4cc] hover:underline">
                          Contacta soporte técnico
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
