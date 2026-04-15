import { useEffect, useState } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);

    setTimeout(() => {
      setToasts((prev) => prev.map((t) => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, duration);
  };

  return { toasts, showToast };
}

const BORDER_COLORS = {
  success: 'border-l-success',
  error: 'border-l-danger',
  info: 'border-l-info',
  warning: 'border-l-warning',
};

const ICONS = {
  success: <span className="text-success font-bold">✓</span>,
  error: <span className="text-danger font-bold">✕</span>,
  info: <span className="text-info font-bold">ℹ</span>,
  warning: <span className="text-warning font-bold">⚠</span>,
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-8 right-8 z-[999] flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-5 py-4 rounded-xl bg-bg-secondary border border-border-light border-l-[4px] ${BORDER_COLORS[toast.type] || BORDER_COLORS.info
            } text-sm font-semibold text-text-primary flex items-center gap-3 shadow-soft min-w-[280px] ${toast.exiting ? 'animate-slide-out-right' : 'animate-slide-in-up'
            }`}
        >
          {ICONS[toast.type] || ICONS.info}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
