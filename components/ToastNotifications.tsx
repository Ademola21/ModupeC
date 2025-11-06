import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { CloseIcon } from './icons/CloseIcon';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false); // Trigger exit animation
            setTimeout(() => onDismiss(toast.id), 300); // Remove from DOM after animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => onDismiss(toast.id), 300);
    };

    const typeStyles = {
        success: {
            icon: <CheckCircleIcon className="w-6 h-6 text-green-400" />,
            progressBarClass: 'bg-green-400',
        },
        error: {
            icon: null, // Placeholder for error icon
            progressBarClass: 'bg-red-500',
        },
        info: {
            icon: null, // Placeholder for info icon
            progressBarClass: 'bg-blue-500',
        },
    };
    
    const currentTypeStyle = typeStyles[toast.type];

    return (
        <div
            className={`relative w-full max-w-sm rounded-xl shadow-2xl overflow-hidden bg-background-secondary/80 backdrop-blur-lg border border-white/10 transition-all duration-300 ease-in-out transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}
        >
            <div className="flex items-center p-4">
                {currentTypeStyle.icon && <div className="flex-shrink-0">{currentTypeStyle.icon}</div>}
                <div className="ml-3 flex-1">
                    <p className="font-semibold text-text-primary">{toast.message}</p>
                </div>
                <button onClick={handleDismiss} className="ml-4 p-1 rounded-full text-text-muted hover:bg-white/10 transition-colors">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div className={`h-full ${currentTypeStyle.progressBarClass} animate-progress-bar`} />
            </div>
        </div>
    );
};

const ToastContainer: React.FC<{ toasts: ToastMessage[]; removeToast: (id: number) => void }> = ({ toasts, removeToast }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-5 right-5 z-[200] space-y-3">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
      ))}
    </div>,
    document.body
  );
};


export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts(prevToasts => [...prevToasts, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};