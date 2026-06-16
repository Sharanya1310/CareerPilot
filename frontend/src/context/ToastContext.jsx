import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2  className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
  error:   <XCircle       className="w-4 h-4 text-red-500    flex-shrink-0" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500  flex-shrink-0" />,
  info:    <Info          className="w-4 h-4 text-indigo-500 flex-shrink-0" />,
};

const ACCENT = {
  success: 'border-l-emerald-500',
  error:   'border-l-red-500',
  warning: 'border-l-amber-500',
  info:    'border-l-indigo-500',
};

function ToastItem({ id, type = 'info', title, message, onRemove }) {
  return (
    <div
      className={`
        flex items-start gap-3 w-80 max-w-[90vw]
        bg-card border border-border border-l-2 ${ACCENT[type]}
        rounded-xl px-4 py-3
        shadow-[var(--shadow-md)]
        animate-slide-in-right
      `}
    >
      {ICONS[type]}
      <div className="flex-1 min-w-0">
        {title && <p className="text-[11px] font-bold text-foreground leading-snug">{title}</p>}
        {message && <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{message}</p>}
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-muted-foreground hover:text-foreground transition flex-shrink-0 mt-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx.toast;
}
