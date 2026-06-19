import { createContext, useCallback, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const ToastContext = createContext<{
  notify: (type: ToastType, title: string, message?: string) => void;
} | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, type, title, message }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismiss = (id: number) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 w-[min(92vw,380px)]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in rounded-xl border px-4 py-3.5 backdrop-blur-xl shadow-2xl flex items-start gap-3 ${
              t.type === 'success'
                ? 'border-emerald-500/40 bg-emerald-950/85'
                : t.type === 'error'
                ? 'border-rose-500/40 bg-rose-950/85'
                : 'border-sky-500/40 bg-sky-950/85'
            }`}
          >
            {t.type === 'success' && (
              <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-400" />
            )}
            {t.type === 'error' && (
              <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0 text-rose-400" />
            )}
            {t.type === 'info' && (
              <Info className="h-5 w-5 mt-0.5 flex-shrink-0 text-sky-400" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.message && (
                <p className="text-xs text-slate-300 mt-0.5">{t.message}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
