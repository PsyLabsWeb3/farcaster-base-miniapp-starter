// useToast.ts
// Custom hook for managing toast notifications.

import { useState, useCallback } from "react";
import { ToastType } from "../components/Toast";

interface ToastItem {
    id: string;
    message: string;
    type: ToastType;
}

export function useToast() {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((message: string, type: ToastType = "info") => {
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setToasts((prev) => [...prev, { id, message, type }]);
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback(
        (message: string) => addToast(message, "success"),
        [addToast]
    );

    const error = useCallback(
        (message: string) => addToast(message, "error"),
        [addToast]
    );

    const info = useCallback(
        (message: string) => addToast(message, "info"),
        [addToast]
    );

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        info,
    };
}
