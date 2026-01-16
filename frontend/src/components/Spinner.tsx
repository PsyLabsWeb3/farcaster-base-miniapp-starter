// Spinner.tsx
// Loading spinner component with different sizes.

interface SpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function Spinner({ size = "md", className = "" }: SpinnerProps) {
    const sizes = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-10 h-10 border-4",
    };

    return (
        <div
            className={`${sizes[size]} border-[#0052FF] border-t-transparent rounded-full animate-spin ${className}`}
            role="status"
            aria-label="Loading"
        />
    );
}

// Full screen loading overlay
interface LoadingOverlayProps {
    message?: string;
}

export function LoadingOverlay({ message = "Loading..." }: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 z-50 bg-[#0A0B0D]/80 flex flex-col items-center justify-center gap-4">
            <Spinner size="lg" />
            <p className="text-white font-bold uppercase tracking-wide animate-pulse">
                {message}
            </p>
        </div>
    );
}

// Inline loading state for buttons
interface ButtonSpinnerProps {
    loading: boolean;
    children: React.ReactNode;
}

export function ButtonSpinner({ loading, children }: ButtonSpinnerProps) {
    if (loading) {
        return (
            <span className="flex items-center justify-center gap-2">
                <Spinner size="sm" />
                <span>Loading...</span>
            </span>
        );
    }
    return <>{children}</>;
}
