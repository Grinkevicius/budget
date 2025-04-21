import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, AlertCircle, CheckCircle2, Info } from "lucide-react";
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

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                <AnimatePresence mode="sync">
                    {alerts.map(alert => {
                        const Icon = icons[alert.type || 'default'];

                        return (
                            <motion.div
                                key={alert.id}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Alert variant={alert.type} className="w-96">
                                    {alert.title && (
                                        <AlertTitle className="flex items-center gap-1">
                                            <Icon className="h-4 w-4" />
                                            {alert.title}
                                        </AlertTitle>
                                    )}
                                    <AlertDescription>{alert.description}</AlertDescription>
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