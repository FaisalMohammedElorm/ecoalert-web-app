import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const show = (message, type = 'error') => {
    setToast({ message, type, id: Date.now() });
  };

  const hide = () => setToast(null);

  return { toast, show, hide };
}

export default function Toast({ toast, hide }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(hide, 4000);
    return () => clearTimeout(t);
  }, [toast, hide]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-sm font-medium transition-all animate-fade-up max-w-sm w-[90vw] ${
      isError
        ? 'bg-red-50 border-red-100 text-red-700'
        : 'bg-eco-50 border-eco-100 text-eco-700'
    }`}>
      {isError
        ? <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
        : <CheckCircle size={16} className="text-eco-500 flex-shrink-0" />
      }
      <span className="flex-1">{toast.message}</span>
      <button onClick={hide} className="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}
