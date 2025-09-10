import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type AlertType = 'default' | 'error' | 'success' | 'info';

interface AlertOptions {
    title?: string;
    description: string;
    type?: AlertType;
    duration?: number;
}

interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const icons = {
    default: Terminal,
    error: AlertCircle,
    success: CheckCircle2,
    info: Info,
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alerts, setAlerts] = useState<(AlertOptions & { id: number })[]>([]);

    const showAlert = useCallback((options: AlertOptions) => {
        const id = Date.now();
        const duration = options.duration || 5000;

        setAlerts(prev => [...prev, { ...options, id }]);

        setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== id));
        }, duration);
    }, []);

    const dismissAlert = useCallback((id: number) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
                <AnimatePresence mode="sync">
                    {alerts.map(alert => {
                        const Icon = icons[alert.type || 'default'];

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                                transition={{ 
                                    duration: 0.3,
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            >
                                <Alert variant={alert.type} className="w-full shadow-lg border-l-4 relative pr-10">
                                    <button
                                        onClick={() => dismissAlert(alert.id)}
                                        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        aria-label="Dismiss alert"
                                    >
                                        <X className="h-3 w-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
                                    </button>
                                    
                                    {alert.title && (
                                        <AlertTitle className="flex items-center gap-2 text-sm font-semibold pr-6">
                                            <Icon className="h-4 w-4" />
                                            {alert.title}
                                        </AlertTitle>
                                    )}
                                    <AlertDescription className="text-sm mt-1 pr-6">
                                        {alert.description}
                                    </AlertDescription>
                                </Alert>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </AlertContext.Provider>
    );
}

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};