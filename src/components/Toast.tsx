import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        let borderClass = 'border-slate-700 bg-slate-900 text-slate-100';
        let Icon = CheckCircle2;
        let iconColor = 'text-emerald-400';

        if (toast.type === 'error') {
          borderClass = 'border-rose-500/40 bg-rose-950/90 text-rose-100';
          Icon = AlertCircle;
          iconColor = 'text-rose-400';
        } else if (toast.type === 'loading') {
          borderClass = 'border-amber-500/40 bg-slate-900/95 text-amber-200';
          Icon = Loader2;
          iconColor = 'text-amber-400 animate-spin';
        } else if (toast.type === 'success') {
          borderClass = 'border-emerald-500/40 bg-slate-900/95 text-slate-100';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-xs">
              <span className="font-semibold block leading-tight">{toast.title}</span>
              {toast.message && (
                <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="opacity-60 hover:opacity-100 text-sm leading-none p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
