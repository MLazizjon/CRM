import './ToastContext.css';
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
const ToastContext = createContext(null);
const toastConfig = {
  success: {
    icon: CheckCircle,
    color: "#10B981",
    bg: "#ECFDF5",
    border: "#A7F3D0",
  },
  error: {
    icon: XCircle,
    color: "#EF4444",
    bg: "#FEF2F2",
    border: "#FCA5A5",
  },
  warning: {
    icon: AlertTriangle,
    color: "#F59E0B",
    bg: "#FFFBEB",
    border: "#FDE68A",
  },
  info: {
    icon: Info,
    color: "#2563EB",
    bg: "#EFF6FF",
    border: "#BFDBFE",
  },
};
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const toast = useCallback(
    (type, title, message) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [
        ...prev.slice(-4),
        {
          id,
          type,
          title,
          message,
        },
      ]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );
  const success = useCallback((t, m) => toast("success", t, m), [toast]);
  const error = useCallback((t, m) => toast("error", t, m), [toast]);
  const warning = useCallback((t, m) => toast("warning", t, m), [toast]);
  const info = useCallback((t, m) => toast("info", t, m), [toast]);
  return (
    <ToastContext.Provider
      value={{
        toast,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}

      {/* Toast portal */}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 pointer-events-none"
        style={{
          maxWidth: 360,
        }}
      >
        {toasts.map((t) => {
          const cfg = toastConfig[t.type];
          const Icon = cfg.icon;
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-lg"
              style={{
                background: "#ffffff",
                border: `1px solid ${cfg.border}`,
                boxShadow: "0 8px 30px rgba(15,23,42,0.12)",
                animation:
                  "slideInToast 0.25s cubic-bezier(0.16,1,0.3,1) forwards",
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: cfg.bg,
                }}
              >
                <Icon
                  size={15}
                  style={{
                    color: cfg.color,
                  }}
                />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div
                  className="text-sm font-semibold leading-tight"
                  style={{
                    color: "#111827",
                  }}
                >
                  {t.title}
                </div>
                {t.message && (
                  <div
                    className="text-xs mt-0.5 leading-relaxed"
                    style={{
                      color: "#6B7280",
                    }}
                  >
                    {t.message}
                  </div>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors shrink-0 mt-0.5"
                style={{
                  color: "#9CA3AF",
                }}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
