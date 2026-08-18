import React, { useEffect, useState } from 'react';
import { ToastNotification, ToastType } from '../types';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-20 sm:top-24 right-0 left-0 sm:left-auto sm:right-6 z-[100] flex flex-col items-center sm:items-end gap-3 px-4 sm:px-0 pointer-events-none max-w-md w-full ml-auto"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [progress, setProgress] = useState(100);
  const [isHovered, setIsHovered] = useState(false);
  const duration = toast.duration || 5000;

  useEffect(() => {
    if (isHovered) return;

    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(interval);
          onDismiss(toast.id);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [toast.id, duration, isHovered, onDismiss]);

  const config: Record<
    ToastType,
    {
      bg: string;
      border: string;
      iconColor: string;
      iconBg: string;
      progressBar: string;
      defaultIcon: React.ReactNode;
    }
  > = {
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200/80',
      iconColor: 'text-[#2E7D32]',
      iconBg: 'bg-emerald-50 border border-emerald-100',
      progressBar: 'bg-[#2E7D32]',
      defaultIcon: <CheckCircle2 className="w-5 h-5 text-[#2E7D32]" />,
    },
    info: {
      bg: 'bg-white',
      border: 'border-blue-200/80',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border border-blue-100',
      progressBar: 'bg-blue-600',
      defaultIcon: <Info className="w-5 h-5 text-blue-600" />,
    },
    warning: {
      bg: 'bg-white',
      border: 'border-amber-200/80',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border border-amber-100',
      progressBar: 'bg-amber-500',
      defaultIcon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200/80',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50 border border-red-100',
      progressBar: 'bg-red-500',
      defaultIcon: <AlertCircle className="w-5 h-5 text-red-600" />,
    },
  };

  const currentConfig = config[toast.type];

  return (
    <div
      role="alert"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`pointer-events-auto w-full max-w-sm sm:max-w-md ${currentConfig.bg} rounded-2xl border ${currentConfig.border} shadow-xl shadow-slate-900/10 p-4 transition-all duration-300 transform translate-y-0 relative overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-4`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl ${currentConfig.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
          {currentConfig.defaultIcon}
        </div>

        {/* Text Content */}
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-900 leading-tight">
              {toast.title}
            </h4>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
              {toast.type === 'success' ? 'Confirmé' : toast.type === 'info' ? 'Info' : toast.type === 'warning' ? 'Attention' : 'Erreur'}
            </span>
          </div>

          {toast.message && (
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {toast.message}
            </p>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(toast.id)}
          aria-label="Fermer la notification"
          className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg p-1 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Countdown Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100/60 overflow-hidden">
        <div
          className={`h-full ${currentConfig.progressBar} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
