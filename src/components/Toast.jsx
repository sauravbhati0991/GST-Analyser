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
  success: 'border-l-green-400',
  error: 'border-l-red-400',
  info: 'border-l-blue-400',
  warning: 'border-l-amber-400',
};

const ICONS = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

export function ToastContainer({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg bg-[#1a1a24] border border-white/[0.06] border-l-[3px] ${BORDER_COLORS[toast.type] || BORDER_COLORS.info
            } text-sm text-white flex items-center gap-2 shadow-2xl min-w-[250px] ${toast.exiting ? 'animate-slide-out-right' : 'animate-slide-in-up'
            }`}
        >
          <span className="font-bold">{ICONS[toast.type] || 'ℹ'}</span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
