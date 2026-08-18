import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification, ToastType } from '../types';
import { ToastContainer } from '../components/ToastContainer';

interface ToastContextValue {
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id'>) => string;
  success: (title: string, message?: string, duration?: number) => string;
  info: (title: string, message?: string, duration?: number) => string;
  warning: (title: string, message?: string, duration?: number) => string;
  error: (title: string, message?: string, duration?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 5000, icon }: Omit<ToastNotification, 'id'>): string => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: ToastNotification = { id, type, title, message, duration, icon };
      
      setToasts((prev) => {
        // Keep max 4 toasts simultaneously
        const updated = [...prev, newToast];
        return updated.slice(-4);
      });

      return id;
    },
    []
  );

  const success = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast({ type: 'success', title, message, duration }),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast({ type: 'info', title, message, duration }),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast({ type: 'warning', title, message, duration }),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string, duration?: number) =>
      showToast({ type: 'error', title, message, duration }),
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        info,
        warning,
        error,
        removeToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
