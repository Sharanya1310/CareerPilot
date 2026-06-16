import { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';

const ConfirmContext = createContext(null);

function ConfirmDialog({ title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={onCancel} />

      <div className="relative w-full max-w-[300px] rounded-xl shadow-xl animate-scale-in
        bg-white border border-slate-200
        dark:bg-[#111318] dark:border-[#1e2235]">

        {/* Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 rounded-md transition
            text-slate-400 hover:text-slate-600 hover:bg-slate-100
            dark:text-zinc-600 dark:hover:text-zinc-300 dark:hover:bg-white/5"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Content */}
        <div className="px-5 pt-5 pb-4">
          <p className="text-[13px] font-bold pr-5 text-slate-800 dark:text-zinc-100">{title}</p>
          {message && (
            <p className="text-[11px] mt-1.5 leading-relaxed text-slate-500 dark:text-zinc-400">{message}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-4">
          <button
            onClick={onCancel}
            className="flex-1 h-8 rounded-lg text-xs font-semibold transition
              bg-slate-100 text-slate-600 hover:bg-slate-200
              dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            className="flex-1 h-8 rounded-lg text-xs font-semibold transition
              bg-slate-800 text-white hover:bg-slate-700
              dark:bg-zinc-700 dark:hover:bg-zinc-600"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmProvider({ children }) {
  const [dialog, setDialog] = useState(null);

  const confirm = useCallback(({ title, message, confirmLabel, cancelLabel, onConfirm }) => {
    setDialog({ title, message, confirmLabel, cancelLabel, onConfirm });
  }, []);

  const close = useCallback(() => setDialog(null), []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {dialog && (
        <ConfirmDialog {...dialog} onConfirm={dialog.onConfirm} onCancel={close} />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error('useConfirm must be used inside ConfirmProvider');
  return ctx.confirm;
}
